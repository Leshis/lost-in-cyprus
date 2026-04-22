<template>
  <div class="admin-wrap">
    <header class="admin-header">
      <div class="tabs">
        <button :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">Manage Articles</button>
        <button :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">+ New Article</button>
      </div>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <ArticleList 
      v-if="activeTab === 'list'" 
      :articles="articles" 
      @delete="deleteArticle" 
      @edit="handleEdit" 
    />

    <div v-else class="create-section">
      <ArticleForm 
        :form="form" 
        :districts="districts" 
        :categories="categories" 
        :uploading="uploading"
        @submit="uploadArticle"
        @file-change="handleFileChange"
      />
      <p v-if="statusMsg" :class="['status', isError ? 'error' : 'success']">{{ statusMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import ArticleList from '@/components/ArticleList.vue';
import ArticleForm from '@/components/ArticleForm.vue';

const router = useRouter();
const activeTab = ref('list');
const articles = ref([]);
const categories = ref([]);
const districts = ref([]);
const uploading = ref(false);
const statusMsg = ref('');
const isError = ref(false);
const selectedFile = ref(null);
const editingId = ref(null);

const form = reactive({
  title: '',
  district: '',
  content: '',
  category: ''
});

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (!error) articles.value = data;
};

fetchArticles();

const deleteArticle = async (id) => {
  if (confirm("Are you sure? This secret will be lost forever (like Atlantis).")) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      // Refresh the list
      fetchSecrets();
    }
  }
};

const fetchEnums = async () => {
    // Fetch Categories using your category enum name
    const { data: catData } = await supabase.rpc('get_enum_values', { type_name: 'category_type' });
    categories.value = processEnum(catData, ['hiking', 'food', 'culture', 'wine']);

    // Fetch Districts using 'district' from your screenshot
    const { data: distData } = await supabase.rpc('get_enum_values', { type_name: 'district' });
    districts.value = processEnum(distData, ['limassol', 'paphos', 'nicosia', 'larnaca', 'kyrenia', 'famagusta']);
};

// This cleans the {larnaca,paphos} string into a real array
const processEnum = (data, fallback) => {
    const raw = Array.isArray(data) ? data[0] : data;
    if (typeof raw === 'string' && raw !== '') {
        return raw.replace(/{|}/g, '').split(',');
    }
    return fallback;
};

const handleEdit = (article) => {
  form.title = article.title;
  form.district = article.district;
  form.content = article.content;
  form.category = article.category;

  editingId.value = article.id;

  activeTab.value = 'create';
};


fetchEnums();

const handleFileChange = (e) => {
    selectedFile.value = e.target.files[0];
};

const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
};

const uploadArticle = async () => {
    try {
        uploading.value = true;
        statusMsg.value = "Starting upload...";
        isError.value = false;

        if (!selectedFile.value) throw new Error("Please select an image.");

        // 1. Upload Image to Supabase Storage
        const fileExt = selectedFile.value.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('articles') // Make sure this bucket exists!
            .upload(filePath, selectedFile.value);

        if (uploadError) throw uploadError;

        // 2. Save Secret to Database
        const { error: dbError } = await supabase
            .from('articles')
            .insert([
                {
                    title: form.title,
                    district: form.district,
                    content: form.content,
                    image_url: filePath, // We store the filename/path
                    category: form.category
                }
            ]);

        if (dbError) throw dbError;

        statusMsg.value = "Secret successfully published!";
        // Reset form
        Object.assign(form, { title: '', district: '', content: '' });
        selectedFile.value = null;

    } catch (error) {
        isError.value = true;
        statusMsg.value = error.message;
    } finally {
        uploading.value = false;
    }
};
</script>

<style scoped>
.admin-wrap {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.admin-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
.tabs { display: flex; gap: 0.5rem; }
.tabs button { padding: 0.6rem 1.2rem; border: none; cursor: pointer; border-radius: 6px; }
.tabs button.active { background: #b57b52; color: white; }
.logout-btn { background: none; border: 1px solid #ddd; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.status { padding: 1rem; margin-top: 1rem; border-radius: 6px; text-align: center; }
.error { background: #ffebee; color: #c62828; }
.success { background: #e8f5e9; color: #2e7d32; }
</style>