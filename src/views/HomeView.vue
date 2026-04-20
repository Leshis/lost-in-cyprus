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
  display: flex;
  flex-direction: column; /* Mobile: Top/Bottom */
  height: 100vh;
  width: 100vw;
  background-color: #f8f6f0;
  overflow: hidden;
}

.map-section {
  flex: 0 0 45vh; /* Prevents map from being tiny on mobile */
  background-color: #1c2a32;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 20px;
  min-height: 300px;
}

.content-section {
  flex: 1;
  background-color: #f8f6f0;
  overflow-y: auto;
  padding: 16px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -20px; /* The "overlap" effect from your CodePen */
  position: relative;
  z-index: 10;
  box-shadow: 0 -5px 15px rgba(0,0,0,0.08);
}

/* --- NEW: Loading Style --- */
.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
}

/* --- 3. Filters & UI Elements --- */
.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 15px;
  scrollbar-width: none; /* Hides scrollbar on Firefox */
}

.filter-row::-webkit-scrollbar {
  display: none; /* Hides scrollbar on Chrome/Safari */
}

.filter-pill {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  white-space: nowrap;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-pill.active {
  background: #c69f4b;
  color: white;
  border-color: #c69f4b;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.clear-filter {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.85rem;
}

/* --- 4. Card Grid --- */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: Single Column */
  gap: 16px;
  padding-bottom: 40px; /* Space at bottom for scrolling */
}

.location-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background-color: #eee; /* Placeholder color before image loads */
}

.card-content {
  padding: 16px;
}

.category-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #c69f4b;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.card-content h4 {
  margin: 4px 0;
  color: #1a1a1a;
}

.card-content p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.action-btn {
  background: #1c2a32;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}

/* --- 5. DESKTOP RESPONSIVENESS --- */
@media (min-width: 1024px) {
  .app-container {
    flex-direction: row; /* Desktop: Side-by-Side */
  }

  .map-section {
    flex: 0 0 50%; /* Map on left half */
    height: 100vh;
  }

  .content-section {
    flex: 0 0 50%; /* Content on right half */
    height: 100vh;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: 0;
    padding: 30px;
    box-shadow: -5px 0 15px rgba(0,0,0,0.05);
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Grid on wide screens */
  }
}
</style>
