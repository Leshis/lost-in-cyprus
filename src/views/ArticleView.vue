<template>
  <div v-if="article" class="article-page">
    <h1>{{ article.title }}</h1>
    <img :src="article.image" :alt="article.title" />
    <p>{{ article.content }}</p>
  </div>
  <div v-else>
    <h1>Article Not Found</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// This is your "Database" (You can move this to a separate file later)
const allArticles = {
  'paphos': { title: 'Paphos Harbour', image: '/lost-in-cyprus/paphos-harbour.jpg', content: 'Explore the castle...' },
  'limassol': { title: 'Limassol Castle', image: '/lost-in-cyprus/limassol.jpg', content: 'A walk through history...' },
  'famagusta': { title: 'Ghost Town', image: '/lost-in-cyprus/famagusta.jpg', content: 'The abandoned city...' }
};

// This "finds" the right data based on the URL (/article/paphos)
const article = computed(() => allArticles[route.params.id]);
</script>