<template>
  <div class="article-page">
    <header class="article-hero">
      <img
        v-if="article.image_url"
        :src="getImageUrl(article.image_url)"
        :alt="article.title"
        class="hero-bg-img"
      />
      <div v-else class="hero-bg-img fallback-bg" />

      <!-- Back button lives in its own bar, separate from the hero text -->
      <nav v-if="!isPreview" class="hero-nav">
        <button @click="$emit('back')" class="back-btn" aria-label="Go back">
          <span class="back-arrow">←</span>
          <span class="back-label">Back</span>
        </button>
      </nav>

      <div class="hero-overlay">
        <span class="category-pill">{{ article.category || 'Category' }}</span>
        <h1>{{ article.title || 'Untitled Secret' }}</h1>
      </div>
    </header>

    <main class="article-body">
      <div class="meta-info">
        <div class="meta-left">
          <span class="district-tag">📍 {{ capitalise(article.district) }}</span>
          <a
            v-if="article.lat && article.long"
            :href="`https://www.google.com/maps?q=${article.lat},${article.long}`"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
          >
            🗺 View on Map
          </a>
        </div>
        <span class="date">{{ formatDate(article.created_at) }}</span>
      </div>

      <div class="content-text" v-html="article.content" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '@/utils/supabaseHelpers'

interface Article {
  image_url?: string
  title?: string
  category?: string
  district?: string
  lat?: number
  long?: number
  created_at?: string
  content?: string
}

defineProps<{
  article: Article
  isPreview?: boolean
}>()

defineEmits<{
  back: []
}>()

const capitalise = (value?: string): string => {
  if (!value) return 'District'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const formatDate = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date()
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

  

  border: 1px solid #1c2a32;
  border-radius: 4px;
  transition: background 0.2s ease, color 0.2s ease;
}

.map-link:hover {
  background: #1c2a32;
  color: #fff;
}

.content-text {
  line-height: 1.8;
  font-size: 1rem;
  color: #2c3e50;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* ─── Tablet and up ───────────────────────────────────── */
@media (min-width: 640px) {
  .hero-overlay h1 {
    font-size: 1.7rem;
  }

  .hero-overlay {
    padding: 40px 24px 24px;
  }

  .hero-nav {
    padding: 16px 24px;
  }

  .meta-info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .article-body {
    padding: 28px 24px;
  }

  .content-text {
    font-size: 1.05rem;
  }
}

<style scoped>
/* ─── Base (mobile-first) ─────────────────────────────── */

.article-page {
  background: #f8f6f0;
  min-height: 100vh;
}

.article-hero {
  height: 40svh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
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
  background: rgba(255, 255, 255, 0.28);
  border-color: rgba(255, 255, 255, 0.6);
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
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.78));
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.article-body {
  padding: 20px 16px;
  max-height: 520px;
  overflow-y: auto;
}

.meta-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 20px;
  padding-bottom: 12px;
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
  line-height: 1.8;
  font-size: 1rem;
  color: #2c3e50;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* ─── Tablet and up ───────────────────────────────────── */
@media (min-width: 640px) {
  .hero-overlay h1 {
    font-size: 1.7rem;
  }

  .hero-overlay {
    padding: 40px 24px 24px;
  }

  .hero-nav {
    padding: 16px 24px;
  }

  .article-body {
    padding: 28px 24px;
  }

  .content-text {
    font-size: 1.05rem;
  }
}

/* ─── Desktop ─────────────────────────────────────────── */
@media (min-width: 900px) {
  .article-body {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
  }

  .hero-overlay h1 {
    font-size: 2rem;
  }

  .content-text {
    font-size: 1.1rem;
  }
}
</style>