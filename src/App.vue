<template>
  <div id="app-container">

    <nav class="pill-navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-link" @click="closeMenu">
          <img src="/lost-in-cyprus.png" alt="Lost in Cyprus Logo" class="cyprus-icon" />
        </router-link>

        <button class="hamburger-trigger" @click="isMenuOpen = true" aria-label="Open Menu">
          <div class="hamburger-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </nav>

    <div :class="['menu-overlay', { 'is-active': isMenuOpen }]">
      <div class="menu-card">

        <div class="menu-header">
          <svg class="menu-logo-small" viewBox="0 0 100 50" fill="currentColor">
            <path d="M10,25 Q30,10 50,20 T90,10 Q80,30 50,40 T10,25 Z" />
          </svg>
          <button class="close-x" @click="closeMenu">✕</button>
        </div>

        <div class="menu-body">
          <router-link to="/about" class="menu-item" @click="closeMenu">
            ABOUT ME
          </router-link>

          <router-link to="/" class="menu-item" @click="closeMenu">
            DISCOVER SECRETS
          </router-link>

          <div class="search-section">
            <div v-if="!isSearching" @click="isSearching = true" class="pill-search-btn">
              <span class="search-icon">🔍</span> SEARCH
            </div>

            <div v-else class="search-input-wrapper">
              <input v-model="searchQuery" @input="handleSearch" placeholder="Search secrets..." autofocus
                class="search-field" />

              <div v-for="result in searchResults" :key="result.id" class="result-item" @click="goToArticle(result.id)">
                <div class="result-thumb-wrapper">
                  <img :src="getImageUrl(result.image_url)" class="result-thumb" alt="Secret Thumbnail" />
                </div>
                <span class="result-title">{{ result.title }}</span>
              </div>

              <button class="cancel-search" @click="isSearching = false">Cancel</button>
            </div>
          </div>
        </div>

        <div class="menu-footer">
          <p>Discover the unexpected.</p>
        </div>
      </div>
    </div>

    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase'; // Ensure your supabase.js path is correct
import { getImageUrl } from './utils/supabaseHelpers';

const router = useRouter();

// State
const isMenuOpen = ref(false);
const isSearching = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
let searchTimeout = null;

// Helpers
const closeMenu = () => {
  isMenuOpen.value = false;
  isSearching.value = false;
  searchQuery.value = '';
  searchResults.value = [];
};

const handleSearch = () => {
  clearTimeout(searchTimeout);

  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  // Debounce: Wait 300ms after user stops typing
  searchTimeout = setTimeout(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, image_url') // Added image_url here
      .ilike('title', `%${searchQuery.value}%`)
      .limit(5);

    if (error) console.error("Search error:", error);
    searchResults.value = data || [];
  }, 300);
};

const goToArticle = (id) => {
  router.push(`/article/${id}`);
  closeMenu();
};
</script>

<style scoped>
/* --- APP STRUCTURE --- */
#app-container {
  position: relative;
  min-height: 100vh;
  background-color: #f8f6f0;
}

/* --- FLOATING PILL --- */
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
  width: 42px;
  color: #1c2a32;
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

/* --- OVERLAY & CARD --- */
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
  align-items: flex-start;
  margin-bottom: 30px;
}

.menu-logo-small {
  width: 40px;
  color: #1c2a32;
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

/* --- SEARCH STYLES --- */
.search-section {
  width: 100%;
  margin-top: 10px;
}

.pill-search-btn {
  width: 100%;
  background-color: #b57b52;
  color: white;
  border-radius: 40px;
  padding: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}

.search-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.search-field {
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  border: 2px solid #b57b52;
  outline: none;
  text-align: center;
  font-size: 1rem;
}

.results-dropdown {
  background: white;
  border: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:active {
  background-color: #f8f6f0;
}

.result-thumb-wrapper {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  /* Prevents the image from squishing */
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
}

.result-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ensures the image fills the square perfectly */
}

.result-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1c2a32;
  text-align: left;
  /* Align text to the left now that we have images */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Keeps long titles from breaking the layout */
}

/* Adjust dropdown padding to look cleaner with images */
.results-dropdown {
  margin-top: 8px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.cancel-search {
  background: none;
  border: none;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
}

.menu-footer {
  text-align: center;
  margin-top: 40px;
  font-size: 0.8rem;
  color: #bbb;
}
</style>