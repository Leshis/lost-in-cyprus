<template>
  <div id="app-container">
    <nav v-if="!shouldHideNav" class="navbar">
      <div class="nav-content">
        <!-- Logo -->
        <router-link to="/" class="logo-link">
          <img src="/lost-in-cyprus.png" alt="Logo" class="cyprus-icon" />
        </router-link>

        <!-- Desktop: Search + About -->
        <div class="desktop-nav">
          <button v-if="showBack" class="nav-back-btn" @click="router.back()" aria-label="Go back">
            ← Back
          </button>
          <!-- Search -->
          <div class="search-wrapper" ref="searchWrapper">
            <div class="search-bar" :class="{ active: searchOpen }">
              <button class="search-icon-btn" @click="openSearch" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <input v-if="searchOpen" ref="searchInput" v-model="searchQuery" type="text"
                placeholder="Search Cyprus..." class="search-input" @keydown.escape="closeSearch" />
              <button v-if="searchOpen && searchQuery" class="clear-btn" @click="searchQuery = ''">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Search Results Dropdown -->
            <Transition name="dropdown">
              <div v-if="searchOpen && searchQuery && searchResults.length > 0" class="search-dropdown">
                <router-link v-for="result in searchResults" :key="result.id" :to="`/article/${result.slug}`"
                  class="search-result" @click="closeSearch">
                  <img v-if="result.image_url" :src="getImageUrl(result.image_url)" :alt="result.title"
                    class="result-thumb" />
                  <div v-else class="result-thumb result-thumb--placeholder" />
                  <div class="result-text">
                    <span class="result-title">{{ result.title }}</span>
                    <span class="result-meta">{{ result.district }} · {{ result.category }}</span>
                  </div>
                </router-link>
              </div>
              <div v-else-if="searchOpen && searchQuery && searchResults.length === 0"
                class="search-dropdown search-empty">
                No results for "{{ searchQuery }}"
              </div>
            </Transition>
          </div>

          <router-link to="/about" class="nav-link">About</router-link>
        </div>

        <!-- Mobile hamburger -->
        <button type="button" class="hamburger-trigger" aria-label="Open menu" @click="isMenuOpen = true">
          <div class="hamburger-lines">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </nav>

    <TheMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" @navigate="handleNavigation" />

    <main class="main-content">
      <router-view />
    </main>
   <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheMenu from '@/components/TheMenu.vue';
<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheFooter from '@/components/TheFooter.vue'

import { useArticleStore } from '@/stores/articleStore';
import { getImageUrl } from '@/utils/supabaseHelpers';

const isMenuOpen = ref(false);
const router = useRouter();
const route = useRoute();
const articleStore = useArticleStore();

// Search state
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const searchWrapper = ref<HTMLElement | null>(null);

const showBack = computed(() => route.name === 'Article')

const shouldHideNav = computed(() =>
  ['Admin', 'Login'].includes(route.name as string) ||
  ['/gate', '/login'].includes(route.path)
);

// Filter articles by search query
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const q = searchQuery.value.toLowerCase();
  return articleStore.items
    .filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.district.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    )
    .slice(0, 6);
});

const openSearch = async () => {
  searchOpen.value = true;
  await nextTick();
  searchInput.value?.focus();
};

const closeSearch = () => {
  searchOpen.value = false;
  searchQuery.value = '';
};

// Close on outside click
const handleClickOutside = (e: MouseEvent) => {
  if (searchWrapper.value && !searchWrapper.value.contains(e.target as Node)) {
    closeSearch();
  }
};

onMounted(() => {
  articleStore.fetchArticles();
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(() => route.path, () => {
  isMenuOpen.value = false;
  closeSearch();
});

const handleNavigation = (target: string | object) => {
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

/* ── Navbar ───────────────────────────── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 0 40px;
  height: 68px;
  display: flex;
  align-items: center;
  background: rgba(248, 246, 240, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
}

.cyprus-icon {
  height: 36px;
  width: auto;
}

/* ── Desktop nav ──────────────────────── */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3d3d3d;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: rgba(0, 0, 0, 0.06);
}

.nav-link.router-link-active {
  background: #b57b52;
  color: white;
}

.nav-back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3d3d3d;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-back-btn:hover {
  background: rgba(0,0,0,0.06);
}

/* ── Search ───────────────────────────── */
.search-wrapper {
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0 6px 0 10px;
  height: 38px;
  transition: width 0.3s ease, border-color 0.2s;
  width: 38px;
  overflow: hidden;
}

.search-bar.active {
  width: 320px;
  border-color: #b57b52;
}

.search-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.2s;
}

.search-icon-btn:hover {
  color: #b57b52;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #1c2a32;
  width: 100%;
  min-width: 0;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #6b7280;
}

/* ── Dropdown ─────────────────────────── */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
}

.search-result:last-child {
  border-bottom: none;
}

.search-result:hover {
  background: #faf9f7;
}

.result-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.result-thumb--placeholder {
  background: #e5e7eb;
}

.result-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.result-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c2a32;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: capitalize;
}

.search-empty {
  padding: 16px;
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
}

/* ── Dropdown transition ──────────────── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Hamburger (mobile only) ──────────── */
.hamburger-trigger {
  display: none;
  background: white;
  border: 1px solid #eee;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.hamburger-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hamburger-lines span {
  display: block;
  width: 18px;
  height: 2px;
  background: #1c2a32;
  border-radius: 2px;
}

/* ── Mobile ───────────────────────────── */
@media (max-width: 768px) {
  .navbar {
    background: transparent;
    backdrop-filter: none;
    border-bottom: none;
    padding: 0;
    height: auto;
    top: 20px;
    left: 5%;
    right: 5%;
    max-width: 400px;
    margin: 0 auto;
  }

  .nav-content {
    justify-content: space-between;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-trigger {
    display: flex;
  }
}
</style>