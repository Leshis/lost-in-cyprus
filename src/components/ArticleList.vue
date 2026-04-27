<template>
  <div class="manage-section">

    <div class="search-bar">
      <input
        type="text"
        placeholder="Search articles by title…"
        v-model="searchQuery"
        aria-label="Search articles"
      />
    </div>

    <!-- Mobile cards (< 640px) -->
    <ul class="article-cards" aria-label="Articles list">
      <li v-if="filteredArticles.length === 0" class="empty-state">
        No articles found.
      </li>
      <li
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
      >
        <div class="card-main">
          <span class="card-title">{{ article.title }}</span>
          <StatusBadge :status="resolveStatus(article)" />
        </div>
        <div class="card-actions">
          <button class="btn btn--edit" @click="$emit('edit', article)">Edit</button>
          <button class="btn btn--delete" @click="confirmDelete(article)">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Desktop table (≥ 640px) -->
    <table class="articles-table" aria-label="Articles list">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredArticles.length === 0">
          <td colspan="3" class="empty-state">No articles found.</td>
        </tr>
        <tr v-for="article in filteredArticles" :key="article.id">
          <td class="col-title" :title="article.title">{{ article.title }}</td>
          <td><StatusBadge :status="resolveStatus(article)" /></td>
          <td class="col-actions">
            <button class="btn btn--edit" @click="$emit('edit', article)">Edit</button>
            <button class="btn btn--delete" @click="confirmDelete(article)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Delete confirmation dialog -->
    <dialog ref="dialogRef" class="confirm-dialog" @close="pendingDelete = null">
      <p>Delete <strong>{{ pendingDelete?.title }}</strong>? This cannot be undone.</p>
      <div class="dialog-actions">
        <button class="btn btn--ghost" @click="dialogRef?.close()">Cancel</button>
        <button class="btn btn--delete" @click="handleDeleteConfirmed">Delete</button>
      </div>
    </dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Article } from '@/composables/useAdminArticles'

// ─── Sub-component: status badge ─────────────────────────────────────────────

const StatusBadge = defineComponent({
  props: { status: { type: String as PropType<ArticleStatus>, required: true } },
  setup(props) {
    const label: Record<ArticleStatus, string> = {
      published: 'Published',
      draft:     'Draft',
      scheduled: 'Scheduled',
      expired:   'Expired',
    }
    return () =>
      h('span', { class: `status-badge status-badge--${props.status}` }, label[props.status])
  },
})

// ─── Types ────────────────────────────────────────────────────────────────────

type ArticleStatus = 'published' | 'draft' | 'scheduled' | 'expired'

// ─── Props / emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  articles: Article[]
}>()

const emit = defineEmits<{
  'edit':   [article: Article]
  'delete': [id: string]
}>()

// ─── Search ───────────────────────────────────────────────────────────────────

const searchQuery = ref<string>('')

const filteredArticles = computed<Article[]>(() =>
  props.articles.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
  )
)

// ─── Status resolution ────────────────────────────────────────────────────────

function resolveStatus(article: Article): ArticleStatus {
  const now = new Date()
  const from = article.scheduled_from ? new Date(article.scheduled_from) : null
  const to   = article.scheduled_to   ? new Date(article.scheduled_to)   : null

  if (!article.published) return 'draft'
  if (to && now > to)     return 'expired'
  if (from && now < from) return 'scheduled'
  return 'published'
}

// ─── Delete confirmation ──────────────────────────────────────────────────────

const dialogRef     = ref<HTMLDialogElement | null>(null)
const pendingDelete = ref<Article | null>(null)

function confirmDelete(article: Article): void {
  pendingDelete.value = article
  dialogRef.value?.showModal()
}

function handleDeleteConfirmed(): void {
  if (pendingDelete.value) {
    emit('delete', pendingDelete.value.id)
  }
  dialogRef.value?.close()
}
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
export default defineComponent({ name: 'ManageArticles' })
</script>

<style scoped>
/* ─── Search ──────────────────────────────────────────────────────────────── */

.search-bar {
  margin-bottom: 1.25rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: #b57b52;
  box-shadow: 0 0 0 3px rgba(181, 123, 82, 0.15);
}

/* ─── Mobile cards (default) ──────────────────────────────────────────────── */

.article-cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  background: #fff;
}

.card-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a202c;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

/* Hide cards on desktop */
@media (min-width: 640px) {
  .article-cards {
    display: none;
  }
}

/* ─── Desktop table (≥ 640px) ─────────────────────────────────────────────── */

.articles-table {
  display: none;
}

@media (min-width: 640px) {
  .articles-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }
}

.articles-table th {
  text-align: left;
  padding: 0.875rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  border-bottom: 2px solid #edf2f7;
  background: #fdfcf8;
}

.articles-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #edf2f7;
  font-size: 0.95rem;
  color: #2d3748;
  vertical-align: middle;
}

.col-title {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */

.empty-state {
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  padding: 2.5rem 1rem;
}

/* ─── Status badges ───────────────────────────────────────────────────────── */

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.status-badge--published {
  background: #f0fff4;
  color: #276749;
}

.status-badge--draft {
  background: #f7fafc;
  color: #718096;
}

.status-badge--scheduled {
  background: #ebf8ff;
  color: #2b6cb0;
}

.status-badge--expired {
  background: #fff5f5;
  color: #c53030;
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 36px;
  transition: opacity 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--edit {
  background: #ebf8ff;
  color: #2b6cb0;
}

.btn--edit:hover {
  background: #bee3f8;
}

.btn--delete {
  background: #fff5f5;
  color: #c62828;
}

.btn--delete:hover {
  background: #fed7d7;
}

.btn--ghost {
  background: transparent;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}

.btn--ghost:hover {
  background: #f7fafc;
}

/* ─── Confirm dialog ──────────────────────────────────────────────────────── */

.confirm-dialog {
  border: none;
  border-radius: 12px;
  padding: 1.75rem;
  width: min(420px, 90vw);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  font-family: inherit;
}

.confirm-dialog::backdrop {
  background: rgba(0, 0, 0, 0.4);
}

.confirm-dialog p {
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  color: #2d3748;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>