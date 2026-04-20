<template>
  <div class="home">
    <header class="hero">
      <h1>Explore Sunny Cyprus</h1>
      <p>From ancient ruins to turquoise waters.</p>
    </header>
    <Article-carousel/>
    <section class="grid">
      <div class="card">
        <h3>Limassol Castle</h3>
        <p>A medieval fortress in the heart of the city.</p>
        <router-link to="/limassol" class="btn">Learn More</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
  import ArticleCarousel from '@/components/ArticleCarousel.vue';
</script>

<style scoped>
.hero {
  background: #0088ff;
  color: white;
  text-align: center;
  padding: 80px 20px;
  border-radius: 0 0 20px 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 40px;
}

.card {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.btn {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 15px;
  background: #0088ff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.badge {
  display: block;
  margin-top: 10px;
  color: #999;
  font-size: 0.8rem;
}
</style>