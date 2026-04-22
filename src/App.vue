<template>
  <div id="app-container">
    
    <nav class="pill-navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-link">
          <img src="/lost-in-cyprus.png" alt="Logo" class="cyprus-icon" />
        </router-link>

        <button class="hamburger-trigger" @click="isMenuOpen = true">
          <div class="hamburger-lines">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </nav>

    <TheMenu 
      :isOpen="isMenuOpen" 
      @close="isMenuOpen = false" 
      @navigate="handleNavigation"
    />

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheMenu from '@/components/TheMenu.vue';

const isMenuOpen = ref(false);
const router = useRouter();

const handleNavigation = (id) => {
  isMenuOpen.value = false;
  router.push(`/article/${id}`);
};
</script>

<style>
/* App-wide Container Styles */
#app-container {
  position: relative;
  min-height: 100vh;
  background-color: #f8f6f0;
}

/* Navbar stays here as it's a global app element */
.pill-navbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 6px 8px 6px 18px;
  z-index: 50;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cyprus-icon {
  height: 32px;
  width: auto;
}

.hamburger-trigger {
  background: white;
  border: 1px solid #eee;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.hamburger-lines span {
  display: block;
  width: 18px;
  height: 2px;
  background: #1c2a32;
  margin: 3px 0;
  border-radius: 2px;
}
</style>