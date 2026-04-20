<template>
  <div class="article-container" v-if="article">
    <button @click="$router.back()" class="back-btn">← Back to Map</button>
    
    <img :src="article.image" class="hero-image" />
    
    <div class="article-content">
      <span class="category">{{ article.category }}</span>
      <h1>{{ article.title }}</h1>
      <p class="meta">{{ article.meta }}</p>
      
      <div class="body-text">
        <p>{{ article.fullText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// In a real app, you'd fetch this from an API or a Store
// For now, we'll use the same mock data logic
const route = useRoute();
const articleId = route.params.id;

// Example mock data (you can move this to your Pinia store later)
const article = computed(() => {
  // Logic to find the article by ID from your data
  return {
    title: "Kourion Amphitheater",
    category: "hiking",
    image: "https://images.unsplash.com/photo-1600216172551-085e9e0fc70e",
    fullText: "Kourion was an important city-state on the southwestern coast of Cyprus. The magnificent Greco-Roman theater is the centerpiece of the site...",
    meta: "7 mins away"
  };
});
</script>

<style scoped>
.article-container { background: #f8f6f0; min-height: 100vh; }
.hero-image { width: 100%; height: 300px; object-fit: cover; }
.article-content { padding: 20px; }
.back-btn { margin: 15px; padding: 8px 15px; border-radius: 20px; border: none; background: #1c2a32; color: white; }
</style>
