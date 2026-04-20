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

      <div class="card-grid">
        <div v-for="loc in filteredLocations" :key="loc.id" class="location-card">
          <img :src="loc.image" :alt="loc.title" class="card-img" />
          <div class="card-content">
            <span class="category-tag">{{ loc.category }}</span>
            <h4>{{ loc.title }}</h4>
            <p>{{ loc.desc }}</p>
            <div class="card-footer">
              <small>{{ loc.meta }}</small>
              <button class="action-btn">{{ loc.actionType === 'book' ? 'Book Now' : 'Read More' }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import CyprusMap from '@components/CyprusMap.vue';

const mapStore = useMapStore();
const activeFilter = ref('all');

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

// Your Mock Data converted to a reactive array
const locations = ref([
  { id: 1, title: "Kourion Amphitheater", desc: "Ancient ruins with sea views.", meta: "7 mins away.", image: "https://images.unsplash.com/photo-1600216172551-085e9e0fc70e?auto=format&fit=crop&w=600&q=80", category: "hiking", district: "limassol", actionType: "read" },
  { id: 2, title: "Omodos Village", desc: "Traditional village with cobbled streets.", meta: "15 mins away.", image: "https://images.unsplash.com/photo-1549480112-c2057754f9a3?auto=format&fit=crop&w=600&q=80", category: "wine", district: "limassol", actionType: "book" },
  { id: 3, title: "Aphrodite's Rock", desc: "Mythical birthplace of the goddess.", meta: "22 mins away.", image: "https://images.unsplash.com/photo-1596706900985-0efb75443db4?auto=format&fit=crop&w=600&q=80", category: "beach", district: "paphos", actionType: "read" },
  { id: 4, title: "Troodos Mountains Trail", desc: "Scenic hiking trails through pine forests.", meta: "45 mins away.", image: "https://images.unsplash.com/photo-1621683935261-26cce10609a3?auto=format&fit=crop&w=600&q=80", category: "hiking", district: "nicosia", actionType: "book" }
]);

const filteredLocations = computed(() => {
  return locations.value.filter(loc => {
    const matchDistrict = !mapStore.selectedDistrict || loc.district === mapStore.selectedDistrict;
    const matchCategory = activeFilter.value === 'all' || loc.category === activeFilter.value;
    return matchDistrict && matchCategory;
  });
});
</script>

<style scoped>
/* Scoped CSS from your CodePen variables */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f6f0;
}

.map-section {
  flex: 0 0 40vh;
  background-color: #1c2a32;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f6f0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin-top: -20px; /* Overlap effect */
}

.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 15px;
}

.filter-pill {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  white-space: nowrap;
  cursor: pointer;
}

.filter-pill.active {
  background: #c69f4b;
  color: white;
  border-color: #c69f4b;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.location-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-content {
  padding: 12px;
}

.category-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #c69f4b;
  font-weight: bold;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.action-btn {
  background: #1c2a32;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
}
</style>
