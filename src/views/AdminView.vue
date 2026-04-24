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

    <ArticleList
      v-if="activeTab === 'list'"
      :articles="articles"
      @delete="openDeleteModal"
      @edit="handleEditAndSwitch"
    />

    <div v-else class="admin-editor-layout">
      <div class="create-section">
        <p v-if="editingId" class="editing-banner">
          ✏️ Editing article —
          <button class="link-btn" @click="resetForm">cancel and create new</button>
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

      <aside class="live-preview-section">
        <div class="preview-sticky-wrapper">
          <div class="preview-badge">Live Preview</div>
          <div class="preview-window">
            <ArticleContent :article="form" :isPreview="true" />
          </div>
        </div>
      </aside>
    </div>

    <ConfirmModal
  :isOpen="isModalOpen"
  :title="articleToDelete?.title || 'this article'"
  @confirm="executeDelete"
  @cancel="closeModal"
/>
<p v-if="deleteError" class="status error">{{ deleteError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { supabase } from '../supabase'
import { useAdminArticles } from '@/composables/useAdminArticles'
import { useArticleForm } from '@/composables/useArticleForm'
import { useDeleteModal } from '@/composables/useDeleteModal'
import ArticleContent from '@/components/ArticleContent.vue'
import ArticleList from '@/components/ArticleList.vue'
import ArticleForm from '@/components/ArticleForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { Article } from '@/composables/useAdminArticles'

useHead({
  title: 'Admin',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const router = useRouter()
const activeTab = ref<'list' | 'create'>('list')

const { articles, categories, districts, fetchArticles } = useAdminArticles()

const {
  form, uploading, statusMsg, isError, editingId,
  resetForm, handleEdit, handleFileChange, handleFormError, uploadArticle,
} = useArticleForm(fetchArticles)

const { isModalOpen, articleToDelete, deleteError, openDeleteModal, closeModal, executeDelete } =
  useDeleteModal(articles)

const switchToList = () => {
  activeTab.value = 'list'
  statusMsg.value = ''
}

const handleEditAndSwitch = (article: Article) => {
  handleEdit(article)
  activeTab.value = 'create'
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.admin-wrap {
  max-width: 1600px;
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
  background: white;
  border-radius: 12px;
  max-height: 90dvh;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  min-height: 600px;
  overflow-y: auto;
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

  .admin-editor-layout {
    display: block;
  }
}
</style>