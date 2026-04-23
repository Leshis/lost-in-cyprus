<template>
  <div class="admin-wrap">
    <header class="admin-header">
      <div class="tabs">
        <button :class="{ active: activeTab === 'list' }" @click="switchToList">
          Manage Articles
        </button>
        <button :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">
          + New Article
        </button>
      </div>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <ArticleList v-if="activeTab === 'list'" :articles="articles" @delete="openDeleteModal" @edit="handleEdit" />

    <div v-else class="admin-editor-layout">

      <div class="create-section">
        <p v-if="editingId" class="editing-banner">
          ✏️ Editing article — <button class="link-btn" @click="resetForm">cancel and create new</button>
        </p>

        <ArticleForm v-model:form="form" :districts="districts" :categories="categories" :uploading="uploading"
          :require-image="!editingId" @submit="uploadArticle" @file-change="handleFileChange"
          @error="handleFormError" />

        <p v-if="statusMsg" :class="['status', isError ? 'error' : 'success']">
          {{ statusMsg }}
        </p>
      </div>

      <aside class="live-preview-section">
        <div class="preview-sticky-wrapper">
          <div class="preview-badge">Live Preview</div>
          <div class="preview-window">
            <ArticleContent :article="form" :isPreview="true" />
          </div>
        </div>
      </aside>

    </div>

    <ConfirmModal :isOpen="isModalOpen" :title="articleToDelete?.title || 'this article'" @confirm="executeDelete"
      @cancel="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import ArticleContent from '@/components/ArticleContent.vue'
import ArticleList from '@/components/ArticleList.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import TurndownService from 'turndown';

interface Article {
  id: string
  title: string
  slug: string
  district: string
  content: string
  category: string
  location: string
  image_url: string
  created_at: string
  lat?: number
  long?: number
}

interface ArticleFormFields {
  title: string
  slug: string
  district: string
  content: string
  category: string
  lat: number | null
  long: number | null
  location?: any
}

const router = useRouter()
const activeTab = ref<'list' | 'create'>('list')
const articles = ref<Article[]>([])
const categories = ref<string[]>([])
const districts = ref<string[]>([])
const uploading = ref(false)
const statusMsg = ref('')
const isError = ref(false)
const selectedFile = ref<File | null>(null)
const editingId = ref<string | null>(null)
const isModalOpen = ref(false)
const articleToDelete = ref<Article | null>(null)

const form = reactive<ArticleFormFields>({
  title: '',
  slug: '',
  district: '',
  content: '',
  category: '',
  lat: null,
  long: null
})

const processContent = (rawText: string) => {
  const turndownService = new TurndownService();
  return (turndownService as any).turndown(rawText);
};

// ─── Data fetching ────────────────────────────────────────────────────────────

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select(`*`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch articles:', error.message)
    return
  }
  articles.value = (data as unknown as Article[]) ?? []
}

const fetchEnums = async () => {
  const { data: catData } = await supabase.rpc('get_enum_values', { type_name: 'category_type' })
  if (catData) categories.value = processEnum(catData, ['hiking', 'food', 'culture', 'wine'])

  const { data: distData } = await supabase.rpc('get_enum_values', { type_name: 'district' })
  if (distData) districts.value = processEnum(distData, ['limassol', 'paphos', 'nicosia', 'larnaca', 'kyrenia', 'famagusta'])
}

const processEnum = (data: unknown, fallback: string[]): string[] => {
  const raw = Array.isArray(data) ? data[0] : data
  if (typeof raw === 'string' && raw !== '') {
    return raw.replace(/{|}/g, '').split(',')
  }
  return fallback
}

onMounted(() => {
  fetchArticles()
  fetchEnums()
})

// ─── Form handling ────────────────────────────────────────────────────────────

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
}

const handleFormError = (message: string) => {
  isError.value = true
  statusMsg.value = message
}

const handleEdit = (article: Article) => {
  form.title = article.title
  form.slug = article.slug
  form.district = article.district
  form.content = article.content
  form.category = article.category
  form.lat = article.lat ?? null
  form.long = article.long ?? null

  editingId.value = article.id
  selectedFile.value = null
  statusMsg.value = ''
  activeTab.value = 'create'
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    slug: '',
    district: '',
    content: '',
    category: '',
    lat: null,
    long: null
  })
  selectedFile.value = null
  editingId.value = null
  statusMsg.value = ''
  isError.value = false
}

const switchToList = () => {
  activeTab.value = 'list'
  statusMsg.value = ''
}

// ─── Upload / update ──────────────────────────────────────────────────────────

const uploadArticle = async () => {
  try {
    uploading.value = true
    statusMsg.value = 'Saving...'
    isError.value = false
    const processedMarkdown = processContent(form.content);

    const postgisPoint = `POINT(${form.long} ${form.lat})`;

    let imagePath: string | undefined

    if (selectedFile.value) {
      const fileExt = selectedFile.value.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(fileName, selectedFile.value)

      if (uploadError) throw uploadError
      imagePath = fileName
    }

    if (editingId.value) {
      const updates: Partial<Article> = {
        title: form.title,
        slug: form.slug,
        district: form.district,
        content: processedMarkdown,
        category: form.category,
        location: postgisPoint,
        ...(imagePath && { image_url: imagePath })
      }

      const { error: dbError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', editingId.value)

      if (dbError) throw dbError
      statusMsg.value = 'Article updated successfully!'
    } else {
      if (!imagePath) throw new Error('Please select an image.')

      const { error: dbError } = await supabase
        .from('articles')
        .insert([{
          title: form.title,
          slug: form.slug,
          district: form.district,
          content: form.content,
          category: form.category,
          location: postgisPoint,
          image_url: imagePath
        }])

      if (dbError) throw dbError
      statusMsg.value = 'Article published successfully!'
    }

    resetForm()
    await fetchArticles()
  } catch (err) {
    isError.value = true
    statusMsg.value = err instanceof Error ? err.message : 'An unexpected error occurred.'
  } finally {
    uploading.value = false
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

const openDeleteModal = (id: string) => {
  articleToDelete.value = articles.value.find(a => a.id === id) || null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  articleToDelete.value = null
}

const executeDelete = async () => {
  // Guard clause for TypeScript safety
  if (!articleToDelete.value) return

  const idToDelete = articleToDelete.value.id

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', idToDelete)

  if (error) {
    console.error('Delete failed:', error.message)
  } else {
    articles.value = articles.value.filter(a => a.id !== idToDelete)
  }

  closeModal()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.admin-wrap {
  max-width: 1600px;
  margin: 2rem auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.admin-editor-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;
}

.create-section {
  flex: 1;
  min-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.live-preview-section {
  flex: 1;
}

.preview-sticky-wrapper {
  position: sticky;
  top: 20px;
}

.preview-badge {
  background: #333;
  color: white;
  display: inline-block;
  padding: 4px 12px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px 4px 0 0;
}

.preview-window {
  border: 1px solid #ddd;
  background: white;
  border-radius: 0 8px 8px 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  min-height: 600px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 40px;
}

.preview-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.preview-meta {
  margin-bottom: 2rem;
  color: #666;
  display: flex;
  gap: 10px;
}

.preview-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

.preview-map-mock {
  margin-top: 20px;
  padding: 15px;
  background: #f0fdf4;
  border: 1px dashed #4ade80;
  border-radius: 8px;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tabs button {
  padding: 0.6rem 1.2rem;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.tabs button.active {
  background: #b57b52;
  color: white;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: #f5f5f5;
}

.editing-banner {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #5d4037;
}

.link-btn {
  background: none;
  border: none;
  color: #b57b52;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  text-decoration: underline;
}

.status {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 6px;
  text-align: center;
}

.error {
  background: #ffebee;
  color: #c62828;
}

.success {
  background: #e8f5e9;
  color: #2e7d32;
}

@media (max-width: 1100px) {
  .live-preview-section {
    display: none;
  }

  .admin-wrap {
    max-width: 900px;
  }

  .admin-editor-layout {
    display: block;
  }
}
</style>