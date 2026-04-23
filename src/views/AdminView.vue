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

    <div class="admin-wrap">
    <ArticleList 
      v-if="activeTab === 'list'" 
      :articles="articles" 
      @delete="openDeleteModal" 
      @edit="handleEdit" 
    />

    <ConfirmModal 
      :isOpen="isModalOpen" 
      :title="articleToDelete?.title"
      @confirm="executeDelete"
      @cancel="closeModal"
    />
  </div>

    <div v-else class="create-section">
      <p v-if="editingId" class="editing-banner">
        ✏️ Editing article — <button class="link-btn" @click="resetForm">cancel and create new</button>
      </p>

      <ArticleForm
        v-model:form="form"
        :districts="districts"
        :categories="categories"
        :uploading="uploading"
        :require-image="!editingId"
        @submit="uploadArticle"
        @file-change="handleFileChange"
        @error="handleFormError"
      />

      <p v-if="statusMsg" :class="['status', isError ? 'error' : 'success']">
        {{ statusMsg }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import ArticleList from '@/components/ArticleList.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue';

interface Article {
  id: string
  title: string
  district: string
  content: string
  category: string
  image_url: string
  created_at: string
}

interface ArticleForm {
  title: string
  district: string
  content: string
  category: string
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
const isModalOpen = ref(false);
const articleToDelete = ref(null);

const form = reactive<ArticleForm>({
  title: '',
  district: '',
  content: '',
  category: ''
})

// ─── Data fetching ────────────────────────────────────────────────────────────

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch articles:', error.message)
    return
  }

  articles.value = data ?? []
}

const fetchEnums = async () => {
  const { data: catData } = await supabase.rpc('get_enum_values', { type_name: 'category_type' })
  categories.value = processEnum(catData, ['hiking', 'food', 'culture', 'wine'])

  const { data: distData } = await supabase.rpc('get_enum_values', { type_name: 'district' })
  districts.value = processEnum(distData, ['limassol', 'paphos', 'nicosia', 'larnaca', 'kyrenia', 'famagusta'])
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

const handleFileChange = (file: File) => {
  selectedFile.value = file
}

const handleFormError = (message: string) => {
  isError.value = true
  statusMsg.value = message
}

const handleEdit = (article: Article) => {
  form.title = article.title
  form.district = article.district
  form.content = article.content
  form.category = article.category
  editingId.value = article.id
  selectedFile.value = null
  statusMsg.value = ''
  activeTab.value = 'create'
}

const resetForm = () => {
  Object.assign(form, { title: '', district: '', content: '', category: '' })
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
      // ── Update existing article ──
      const updates: Partial<Article> = {
        title: form.title,
        district: form.district,
        content: form.content,
        category: form.category,
        ...(imagePath && { image_url: imagePath })
      }

      const { error: dbError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', editingId.value)

      if (dbError) throw dbError

      statusMsg.value = 'Article updated successfully!'
    } else {
      // ── Insert new article ──
      if (!imagePath) throw new Error('Please select an image.')

      const { error: dbError } = await supabase
        .from('articles')
        .insert([{
          title: form.title,
          district: form.district,
          content: form.content,
          category: form.category,
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

const openDeleteModal = (id) => {
  // Find the full article object so we can show the title in the modal
  articleToDelete.value = articles.value.find(a => a.id === id);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  articleToDelete.value = null;
};

const executeDelete = async () => {
  if (!articleToDelete.value) return;

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleToDelete.value.id);

  if (error) {
    console.error('Delete failed:', error.message);
  } else {
    // Optimized: Update the UI immediately without a full fetch
    articles.value = articles.value.filter(a => a.id !== articleToDelete.value.id);
  }

  closeModal();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.admin-wrap {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
</style>