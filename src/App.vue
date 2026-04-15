<template>
  <div id="app-container">
    <nav class="navbar">
      <div class="logo">Lost in Cyprus</div>

      <button class="hamburger" @click="isMenuOpen = !isMenuOpen">
        <span v-if="!isMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>

      <div :class="['nav-links', { 'is-active': isMenuOpen }]">
        <router-link to="/" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/about" @click="isMenuOpen = false">About Me</router-link>
      </div>
    </nav>
    <router-view />

    <footer>
      <p>&copy; 2026 Cyprus Travel Guide</p>
    </footer>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const isMenuOpen = ref(false);
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #333;
  color: white;
  position: relative;
}

.hamburger {
  display: block; /* Shown by default for mobile */
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-links {
  display: none; /* Hide links initially */
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #444;
}

.nav-links.is-active {
  display: flex; /* Show when active */
}

/* Optional: Show links and hide hamburger on Desktop */
@media (min-width: 768px) {
  .hamburger { display: none; }
  .nav-links { 
    display: flex; 
    flex-direction: row; 
    position: static; 
    background: none; 
  }
}
</style>