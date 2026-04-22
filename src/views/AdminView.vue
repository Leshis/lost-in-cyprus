<template>
  <div class="admin-wrap">
    <header class="admin-header">
      <h1>Add New Secret</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <form @submit.prevent="uploadSecret" class="secret-form">
      <div class="field">
        <label>Secret Title</label>
        <input v-model="form.title" type="text" placeholder="e.g. The Hidden Sea Caves" required />
      </div>

      <div class="field">
        <label>District</label>
        <select v-model="form.district" required>
          <option value="" disabled>Select a region</option>
          <option value="Paphos">Paphos</option>
          <option value="Limassol">Limassol</option>
          <option value="Larnaca">Larnaca</option>
          <option value="Nicosia">Nicosia</option>
          <option value="Famagusta">Famagusta</option>
        </select>
      </div>

      <div class="field">
        <label>The Secret (Content)</label>
        <textarea v-model="form.content" rows="5" placeholder="Tell the story..." required></textarea>
      </div>

      <div class="field">
        <label>Featured Image</label>
        <input type="file" accept="image/*" @change="handleFileChange" required />
        <p class="hint">Recommended: 1200x800px JPG or WebP</p>
      </div>

      <button type="submit" :disabled="uploading" class="submit-btn">
        {{ uploading ? 'Uploading to Cyprus...' : 'Publish Secret' }}
      </button>

      <p v-if="statusMsg" :class="['status', isError ? 'error' : 'success']">
        {{ statusMsg }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const uploading = ref(false);
const statusMsg = ref('');
const isError = ref(false);
const selectedFile = ref(null);

const form = reactive({
  title: '',
  district: '',
  content: '',
  category: 'Secret' // Default category
});

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

const uploadSecret = async () => {
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
      .from('article-images') // Make sure this bucket exists!
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
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #fdfcf8;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h1 { color: #1c2a32; font-size: 1.5rem; }

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.secret-form { display: flex; flex-direction: column; gap: 1.5rem; }

.field { display: flex; flex-direction: column; gap: 0.5rem; }

label { font-weight: 600; color: #1c2a32; font-size: 0.9rem; }

input, select, textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
}

input:focus, textarea:focus { border-color: #b57b52; outline: none; }

.submit-btn {
  background: #b57b52;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-btn:disabled { background: #ccc; }

.status { padding: 1rem; border-radius: 6px; text-align: center; font-size: 0.9rem; }
.error { background: #ffebee; color: #c62828; }
.success { background: #e8f5e9; color: #2e7d32; }
.hint { font-size: 0.75rem; color: #888; }
</style>