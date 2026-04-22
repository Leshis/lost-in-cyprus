<template>
  <div v-if="article" class="article-page">
    <header 
      class="article-hero" 
      :style="{ backgroundImage: `url(${getImageUrl(article.image_url)})` }"
    >
      <button @click="$router.back()" class="back-btn">← Back</button>
      <div class="hero-overlay">
        <span class="category-pill">{{ article.category }}</span>
        <h1>{{ article.title }}</h1>
      </div>
    </header>

    <main class="article-body">
      <div class="meta-info">
        <span class="district-tag">📍 {{ article.district }}</span>
        <span class="date">{{ new Date(article.created_at).toLocaleDateString() }}</span>
      </div>

      <div class="content-text">
        {{ article.content }}
      </div>

      <div v-if="article.affiliate_url" class="cta-box">
        <h3>Ready to experience this?</h3>
        <p>Support our site by booking through our partner link.</p>
        <a :href="article.affiliate_url" target="_blank" class="book-btn">Book Now</a>
      </div>
    </main>
  </div>

  <div v-else class="error-state">
    <p v-if="articleStore.loading">Loading secret details...</p>
    <p v-else>Secret not found. It might have been moved.</p>
    <button @click="$router.push('/')">Return Home</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/articleStore'
// 1. Import the helper
import { getImageUrl } from '@/utils/supabaseHelpers' 

const route = useRoute()
const articleStore = useArticleStore()

onMounted(() => {
  if (articleStore.items.length === 0) {
    articleStore.fetchArticles()
  }
})

const article = computed(() => {
  return articleStore.getArticleById(route.params.id)
})
</script>

<style scoped>
.article-page {
  background: #f8f6f0;
  min-height: 100vh;
}

.article-hero {
  height: 40dvh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.hero-overlay {
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  width: 100%;
  padding: 40px 20px 20px;
  color: white;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255,255,255,0.9);
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.category-pill {
  background: #c69f4b;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.article-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 25px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.content-text {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
  white-space: pre-wrap; /* Keeps your database line breaks! */
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
</style>
