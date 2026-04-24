<template>
  <div id="app-container">
    <nav v-if="!shouldHideNav" class="pill-navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-link">
          <img src="/lost-in-cyprus.png" alt="Logo" class="cyprus-icon" />
        </router-link>

        <button 
          type="button"
          class="hamburger-trigger" 
          aria-label="Open menu"
          @click="isMenuOpen = true"
        >
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
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheMenu from '@/components/TheMenu.vue';

const isMenuOpen = ref(false);
const router = useRouter();
const route = useRoute();

const shouldHideNav = computed(() => {
  return ['Admin', 'Login'].includes(route.name) || ['/gate', '/login'].includes(route.path);
});

watch(() => route.path, () => {
  isMenuOpen.value = false;
});

const handleNavigation = (target) => {
  isMenuOpen.value = false;
  const destination = typeof target === 'object' ? target : `/article/${target}`;
  router.push(destination);
};
</script>

<style scoped>
#app-container {
  position: relative;
  min-height: 100vh;
  background-color: #f8f6f0;
}

.pill-navbar {
  position: absolute;
  top: 20px;
  left: 5%;          /* instead of left: 50% + transform */
  right: 5%;         /* just use left/right margins */
  max-width: 400px;
  margin: 0 auto;
  /* remove transform entirely */
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

.hamburger-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hamburger-lines span {
  display: block;
  width: 18px;
  height: 2px;
  background: #1c2a32;
  margin: 2px 0;
  border-radius: 2px;
}
</style>
