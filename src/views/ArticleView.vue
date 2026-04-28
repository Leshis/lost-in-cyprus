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

.article-hero {
  height: 45svh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.fallback-bg {
  background-color: #1c2a32;
}

.hero-nav {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.back-btn:hover {
  background: rgba(255,255,255,0.28);
  border-color: rgba(255,255,255,0.6);
}

.back-btn:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

.back-arrow {
  font-size: 1rem;
  line-height: 1;
}

.hero-overlay {
  position: relative;
  z-index: 1;
  background: linear-gradient(transparent, rgba(0,0,0,0.78));
  width: 100%;
  padding: 32px 16px 16px;
  color: #fff;
}

.hero-overlay h1 {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.3;
}

.category-pill {
  display: inline-block;
  margin-bottom: 8px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.article-body {
  padding: 24px 16px 60px;
}

.article-inner {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.meta-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

.meta-left {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.map-link {
  color: #1c2a32;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 2px 8px;
  border: 1px solid #1c2a32;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
}

.map-link:hover {
  background: #1c2a32;
  color: #fff;
}

.content-text {
  line-height: 1.85;
  font-size: 1rem;
  color: #2c3e50;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* ── Tablet ───────────────────────────────── */
@media (min-width: 640px) {
  .article-hero {
    height: 50svh;
  }

  .hero-overlay h1 {
    font-size: 1.7rem;
  }

  .hero-overlay {
    padding: 40px 32px 28px;
  }

  .hero-nav {
    padding: 16px 32px;
  }

  .article-body {
    padding: 36px 32px 80px;
  }

  .content-text {
    font-size: 1.05rem;
  }
}

/* ── Desktop ──────────────────────────────── */
@media (min-width: 1024px) {
  .article-hero {
    height: 60svh;
  }

  .hero-nav {
    padding-top: 80px;
    padding-left: 48px;
    display: none;
  }

  .hero-overlay {
    padding: 60px 48px 36px;
  }

  .hero-overlay h1 {
    font-size: 2.4rem;
    max-width: 720px;
  }

  .article-body {
    padding: 52px 48px 100px;
  }

  .content-text {
    font-size: 1.1rem;
  }
}
</style>
