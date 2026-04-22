<template>
  <div :class="['menu-overlay', { 'is-active': isOpen }]">
    <div class="menu-card">
      <div class="menu-header">
        <img src="/lost-in-cyprus.png" class="menu-logo-small" alt="Logo" />
        <button class="close-x" @click="emit('close')">✕</button>
      </div>

      <div class="menu-body">
        <router-link to="/about" class="menu-item" @click="emit('close')">ABOUT ME</router-link>
        <router-link to="/" class="menu-item" @click="emit('close')">DISCOVER SECRETS</router-link>
        
        <SearchBar @select="(id) => emit('navigate', id)" />
      </div>

      <div class="menu-footer">
        <p>Discover the unexpected.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchBar from './SearchBar.vue';

// Define the data coming IN from App.vue
defineProps(['isOpen']);

// Define the events going OUT to App.vue
const emit = defineEmits(['close', 'navigate']);
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(28, 42, 50, 0.4);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.menu-overlay.is-active {
  opacity: 1;
  pointer-events: auto;
}

.menu-card {
  width: 90%;
  max-width: 350px;
  background: white;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-overlay.is-active .menu-card {
  transform: scale(1);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.menu-logo-small {
  height: 30px;
  width: auto;
}

.close-x {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #b57b52;
  cursor: pointer;
}

.menu-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.menu-item {
  text-decoration: none;
  color: #1c2a32;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.menu-footer {
  text-align: center;
  margin-top: 40px;
  font-size: 0.8rem;
  color: #bbb;
}
</style>