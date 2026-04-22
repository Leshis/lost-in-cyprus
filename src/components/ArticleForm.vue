<template>
  <form @submit.prevent="$emit('submit')" class="article-form">
    <div class="field">
      <label>Article Title</label>
      <input v-model="form.title" type="text" required />
    </div>

    <div class="field">
      <label>District</label>
      <select v-model="form.district" required>
        <option value="" disabled>Select a region</option>
        <option v-for="dist in districts" :key="dist" :value="dist">
          {{ dist.charAt(0).toUpperCase() + dist.slice(1) }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Content</label>
      <textarea v-model="form.content" rows="5" required></textarea>
    </div>

    <div class="field">
      <label>Category</label>
      <select v-model="form.category" required>
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Featured Image</label>
      <input type="file" accept="image/*" @change="$emit('file-change', $event)" />
    </div>

    <button type="submit" :disabled="uploading" class="submit-btn">
      {{ uploading ? 'Uploading...' : 'Publish Article' }}
    </button>
  </form>
</template>

<script setup>
defineProps(['form', 'districts', 'categories', 'uploading']);
defineEmits(['submit', 'file-change']);
</script>

<style scoped>
.article-form { display: flex; flex-direction: column; gap: 1.2rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
label { font-weight: 600; font-size: 0.9rem; }
input, select, textarea { padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; }
.submit-btn {
  background: #b57b52;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.submit-btn:disabled { background: #ccc; }
</style>