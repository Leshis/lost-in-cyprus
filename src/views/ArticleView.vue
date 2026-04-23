<template>
  <div class="article-page">
    <div v-if="isLoading" class="status-state">
      <div class="spinner" aria-label="Loading article" />
      <p class="status-text">Loading…</p>
    </div>

    <div v-else-if="error" class="status-state error-state">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadData(currentSlug)">Try again</button>
    </div>

    <ArticleContent v-else-if="article" :article="article" @back="goBack" />

    <div v-else class="status-state">
      <p class="status-text">Article not found.</p>
      <button class="retry-btn" @click="goBack">Go back</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useArticleStore } from '@/stores/articleStore'
import ArticleContent from '@/components/ArticleContent.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const isLoading = ref(false)
const error = ref<string | null>(null)

const currentSlug = computed(() => route.params.slug as string)
const article = computed(() => articleStore.getArticleBySlug(currentSlug.value))

// FIX: Pass reactive values directly — no need to wrap in computed() inside useHead()
useHead({
  title: () => article.value?.title ?? 'Secret',
  meta: [
    {
      name: 'description',
      content: () =>
        article.value?.content
          ? article.value.content.slice(0, 155).trimEnd() + '…'
          : 'Discover local secrets',
    },
  ],
})

const loadData = async (slug: string) => {
  // FIX: Guard against missing or stringified-undefined slugs at the call site
  if (!slug || slug === 'undefined') return

  // Already cached — no fetch needed
  if (articleStore.getArticleBySlug(slug)) return

  isLoading.value = true
  error.value = null

  try {
    await articleStore.fetchArticleBySlug(slug)
  } catch (err) {
    console.error('Failed to load article:', err)
    error.value = 'Failed to load this secret. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// FIX: Use { immediate: true } so this handles both initial load and slug changes,
// removing the need for a separate onMounted call.
watch(currentSlug, (slug) => loadData(slug), { immediate: true })

const goBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.article-page {
  background: #f8f6f0;
  min-height: 100vh;
}

/* Shared layout for loading / error / not-found states */
.status-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  padding: 24px;
}

.status-text {
  color: #555;
  font-size: 1rem;
}

.error-state {
  gap: 12px;
}

.error-message {
  color: #c0392b;
  font-size: 1rem;
  text-align: center;
}

.retry-btn {
  background: #1c2a32;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.85;
}

.retry-btn:focus-visible {
  outline: 3px solid #1c2a32;
  outline-offset: 2px;
}

/* Spinner */
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #ddd;
  border-top-color: #c69f4b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
