<template>
  <div class="manage-section">
    <div class="search-bar">
      <input type="text" placeholder="Search articles by title..." v-model="searchQuery" />
    </div>
    
    <table class="articles-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>District</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in filteredArticles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.district }}</td>
          <td class="actions">
            <button @click="$emit('edit', article)" class="edit-btn">Edit</button>
            <button @click="$emit('delete', article.id)" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps(['articles']);
defineEmits(['edit', 'delete']);

const searchQuery = ref('');
const filteredArticles = computed(() => {
  return props.articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.articles-table {
  width: 100%;
  border-collapse: collapse;
}
.articles-table th {
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #eee;
  background: #fdfcf8;
}
.articles-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.actions { display: flex; gap: 0.5rem; }
.edit-btn { background: #e3f2fd; color: #1976d2; padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; }
.delete-btn { background: #ffebee; color: #c62828; padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; }
</style>