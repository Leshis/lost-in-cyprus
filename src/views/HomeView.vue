<template>
  <div class="app-container">
    <aside class="map-section">
      <div class="map-wrapper">
        <CyprusMap /> 
      </div>
    </aside>

    <main class="content-section">
      <div class="filter-row">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="filter-pill"
          :class="{ active: activeFilter === cat.id }"
          @click="activeFilter = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="results-header">
        <h3>{{ filteredLocations.length }} Secrets in {{ activeDistrictName }}</h3>
        <button v-if="activeFilter !== 'all'" class="clear-filter" @click="activeFilter = 'all'">
          ⨂ Clear Filter
        </button>
      </div>

      <div v-if="articleStore.loading" class="loading-state">
        <p>Loading Cyprus secrets...</p>
      </div>

      <div v-else class="card-grid">
        <div v-for="loc in filteredLocations" :key="loc.id" class="location-card">
          <img :src="loc.image_url" :alt="loc.title" class="card-img" />
          
          <div class="card-content">
            <span class="category-tag">{{ loc.category }}</span>
            <h4>{{ loc.title }}</h4>
            
            <p>{{ loc.content ? loc.content.substring(0, 80) + '...' : '' }}</p>
            
            <div class="card-footer">
              <small style="text-transform: capitalize;">{{ loc.district }}</small>
              
              <button class="action-btn" @click="handleAction(loc)">
                {{ loc.affiliate_url ? 'Book Now' : 'Read More' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Added router import
import { useMapStore } from '@/stores/mapStore';
import { useArticleStore } from '@/stores/articleStore';
import CyprusMap from '@/components/CyprusMap.vue';

const mapStore = useMapStore();
const articleStore = useArticleStore();
const router = useRouter(); // Initialize router
const activeFilter = ref('all');

// Fetch live data on load
onMounted(() => {
  articleStore.fetchArticles();
});

const categories = [
  { id: 'all', label: 'All' },
  { id: 'hiking', label: '🧗 Hiking' },
  { id: 'wine', label: '🍷 Wine' },
  { id: 'beach', label: '🏖️ Beach' }
];

const activeDistrictName = computed(() => {
  return mapStore.selectedDistrict 
    ? mapStore.selectedDistrict.charAt(0).toUpperCase() + mapStore.selectedDistrict.slice(1)
    : 'Cyprus';
});

// UPDATED: Filters directly from the Pinia Store instead of mock data
const filteredLocations = computed(() => {
  return articleStore.items.filter(loc => {
    const matchDistrict = !mapStore.selectedDistrict || loc.district === mapStore.selectedDistrict;
    const matchCategory = activeFilter.value === 'all' || loc.category === activeFilter.value;
    return matchDistrict && matchCategory;
  });
});

// NEW: Smart routing for Affiliate Links vs Internal Pages
const handleAction = (loc) => {
  if (loc.affiliate_url) {
    window.open(loc.affiliate_url, '_blank');
  } else {
    router.push(`/article/${loc.id}`);
  }
};
</script>

<style scoped>
/* --- 1. Variables & Root --- */
:root {
  --bg-color: #f8f6f0;
  --map-bg: #1c2a32;
  --card-bg: #ffffff;
  --gold-accent: #c69f4b;
  --border-radius: 12px;
}

/* --- 2. Layout Structure --- */
.app-container {
  display: flex
