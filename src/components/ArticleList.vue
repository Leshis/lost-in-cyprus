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
        <tr v-if="filteredArticles.length === 0">
          <td colspan="3" class="empty-state">No articles found.</td>
        </tr>
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Article } from '@/composables/useAdminArticles'

const props = defineProps<{
  articles: Article[]
}>()

defineEmits<{
  (e: 'edit', article: Article): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')

const filteredArticles = computed(() =>
  props.articles.filter(a =>
    a.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) // null-safe
  )
)
</script>

<style scoped>
.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
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
.empty-state {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 2rem;
}
.actions { display: flex; gap: 0.5rem; }
.edit-btn { background: #e3f2fd; color: #1976d2; padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; }
.delete-btn { background: #ffebee; color: #c62828; padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; }
</style>