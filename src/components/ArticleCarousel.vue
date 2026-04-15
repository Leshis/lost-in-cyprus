<template>
  <div 
    class="carousel"
    @mousedown="startSwipe"
    @mouseup="endSwipe"
    @touchstart="startSwipe"
    @touchend="endSwipe"
  >
    <div class="carousel-inner">
      <transition name="fade" mode="out-in">
        <router-link 
          :key="currentIndex" 
          :to="articles[currentIndex].path" 
          class="slide-link"
        >
          <div class="slide">
            <img :src="articles[currentIndex].image" :alt="articles[currentIndex].title" />
            <div class="slide-content">
              <h2>{{ articles[currentIndex].title }}</h2>
              <p>Click to read article →</p>
            </div>
          </div>
        </router-link>
      </transition>
    </div>

    <div class="dots">
      <span v-for="(article, index) in articles" :key="index" :class="{ active: index === currentIndex }"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const articles = [
  { title: "Limassol Castle", path: "/article/limassol", image: "/lost-in-cyprus/images/limassol.jpg" },
  { title: "Paphos Harbour", path: "/article/paphos", image: "/lost-in-cyprus/images/paphos.jpg" },
];

const currentIndex = ref(0);
let timer = null;
let startX = 0;

// 1. Automatic Rotation
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % articles.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + articles.length) % articles.length;
};

const resetTimer = () => {
  clearInterval(timer);
  timer = setInterval(nextSlide, 7000);
};

// 2. Click Logic (For PC)
const handleManualClick = () => {
  nextSlide();
  resetTimer();
};

// 3. Swipe Logic (For Mobile & PC Drag)
const startSwipe = (e) => {
  // Capture start position (handles both mouse and touch)
  startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
};

const endSwipe = (e) => {
  const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
  const distance = startX - endX;

  if (Math.abs(distance) > 50) { // Minimum swipe distance of 50px
    if (distance > 0) nextSlide(); // Swipe Left -> Next
    else prevSlide();              // Swipe Right -> Prev
    resetTimer();
  }
};

onMounted(() => {
  timer = setInterval(nextSlide, 7000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  height: 450px;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer; /* Shows user it's clickable */
  user-select: none; /* Prevents text highlighting while swiping */
}

/* Rest of your styles remain the same as before */
.carousel-inner, .slide { width: 100%; height: 100%; }
img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.slide-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white; padding: 40px 20px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.dots { position: absolute; bottom: 20px; right: 20px; display: flex; gap: 8px; }
.dots span { width: 10px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 50%; }
.dots span.active { background: white; }
</style>