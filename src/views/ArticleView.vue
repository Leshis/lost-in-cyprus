<template>
  <div v-if="article" class="article-page">
    <header class="article-hero">
      <img v-if="article.image_url" :src="getImageUrl(article.image_url)" :alt="article.title" class="hero-bg-img"
        fetchpriority="high" />
      <div v-else class="hero-bg-img fallback-bg"></div>

      <button @click="goBack" class="back-btn">← Back</button>

      <div class="hero-overlay">
        <span class="category-pill">{{ article.category }}</span>
        <h1>{{ article.title }}</h1>
      </div>
    </header>

    <main class="article-body">
      <div class="meta-info">
        <div class="meta-left">
          <span class="district-tag">📍 {{ article.district }}</span>
          <a v-if="article?.lat && article?.long"
            :href="`https://www.google.com/maps/search/?api=1&query=${article.lat},${article.long}`" target="_blank"
            rel="noopener noreferrer" class="map-link">
            📍 View on Map
          </a>
        </div>
        <span class="date">{{ formatDate(article.created_at) }}</span>
      </div>



      <div class="content-text">
        {{ article.content }}
      </div>

      <div v-if="article.affiliate_url" class="cta-box">
        <h3>Ready to experience this?</h3>
        <p>Support our site by booking through our partner link.</p>
        <a :href="article.affiliate_url" target="_blank" rel="noopener noreferrer" class="book-btn">Book Now</a>
      </div>
    </main>
  </div>

  <div v-else class="error-state">
    <p v-if="isLoading || articleStore.loading">Loading secret details...</p>
    <p v-else>Secret not found. It might have been moved.</p>
    <button @click="router.push('/')">Return Home</button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/articleStore'
import { getImageUrl } from '@/utils/supabaseHelpers'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true;
  const id = route.params.id;

  const existing = articleStore.getArticleById(id);

  if (!existing || existing.lat === undefined) {
    await articleStore.fetchArticleById(id);
  }
  isLoading.value = false;
});

const article = computed(() => {
  return articleStore.getArticleById(route.params.id)
})

const goBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.article-page {
  background: #f8f6f0;
  min-height: 100vh;
}

.article-hero {
  height: 40dvh;
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.fallback-bg {
  background-color: #1c2a32;
}

.hero-overlay {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  width: 100%;
  padding: 40px 20px 20px;
  color: white;
  position: relative;
  z-index: 1;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  z-index: 1;
}

.back-btn:focus-visible,
.book-btn:focus-visible,
button:focus-visible {
  outline: 3px solid #1c2a32;
  outline-offset: 2px;
}

.category-pill {
  background: #c69f4b;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 8px;
}

.article-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.content-text {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
  white-space: pre-wrap;
}

.cta-box {
  margin-top: 40px;
  padding: 30px;
  background: #1c2a32;
  color: white;
  border-radius: 12px;
  text-align: center;
}

.book-btn {
  display: inline-block;
  margin-top: 15px;
  background: #c69f4b;
  color: white;
  padding: 12px 30px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 15px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 25px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.meta-left {
  display: flex;
  gap: 15px;
  align-items: center;
}

.map-link {
  color: #c69f4b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 2px 8px;
  border: 1px solid #c69f4b;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.map-link:hover {
  background: #c69f4b;
  color: white;
}
</style>
