<template>
  <div class="app-container">
    <aside class="map-section">
      <CyprusMap />
    </aside>

    <main class="content-section">
      <div class="filter-row">
        <button
          v-for="cat in dynamicCategories"
          :key="cat.id"
          class="filter-pill"
          :class="{ active: activeFilter === cat.id }"
          @click="activeFilter = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <h3 class="results-header">
        {{ filteredLocations.length }} Secrets in {{ activeDistrictName }}
      </h3>

      <div v-if="articleStore.loading" class="loading-state">
        <p>Loading Cyprus secrets…</p>
      </div>

      <div v-else-if="filteredLocations.length === 0" class="empty-state">
        <p>No secrets found here yet. Try a different category!</p>
        <button @click="resetFilters">Reset filters</button>
      </div>

      <div v-else class="card-grid">
        <div
          v-for="loc in filteredLocations"
          :key="loc.id"
          class="location-card"
        >
          <img :src="getImageUrl(loc.image_url ?? '')" :alt="loc.title" class="card-img" />

          <div class="card-content">
            <span class="category-tag">{{ loc.category.replace('_', ' ') }}</span>
            <h4>{{ loc.title }}</h4>
            <p>{{ loc.content ? stripHtml(loc.content).substring(0, 80) + '…' : '' }}</p>

            <div class="card-footer">
              <small>{{ loc.district }}</small>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '@/stores/mapStore'
import { Article, useArticleStore } from '@/stores/articleStore'
import CyprusMap from '@/components/CyprusMap.vue'
import { getImageUrl } from '@/utils/supabaseHelpers'

interface Category {
  id: string
  label: string
}

interface Location {
  id: string
  slug: string
  title: string
  category: string
  district: string
  content: string
  image_url: string
  affiliate_url?: string
}

// ─── Map Supabase enums to emojis ──────────────────────────────────────────
const CATEGORY_EMOJIS: Record<string, string> = {
  beaches: '🏖️',
  hiking: '🥾',
  wine: '🍷',
  culture: '🏛️',
  archaeology: '🏺',
  gastronomy: '🍲',
  religious: '⛪',
  rural: '🏡',
  diving: '🤿',
  nightlife: '🪩',
  nature: '🌿',
  family: '🎡',
  wellness: '🧘‍♀️',
  hidden_gems: '💎',
}

const mapStore = useMapStore()
const articleStore = useArticleStore()
const router = useRouter()
const activeFilter = ref<string>('all')

onMounted(() => articleStore.fetchArticles())

// ─── Format snake_case to Title Case with Emoji ────────────────────────────
const formatCategoryLabel = (cat: string): string => {
  const emoji = CATEGORY_EMOJIS[cat.toLowerCase()] ?? '📍'
  
  // Converts 'hidden_gems' into 'Hidden Gems'
  const formattedText = cat
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    
  return `${emoji} ${formattedText}`
}

const dynamicCategories = computed<Category[]>(() => {
  const unique = [...new Set(
    articleStore.items.map(i => i.category).filter(Boolean)
  )]
  return [
    { id: 'all', label: 'All' },
    ...unique.map(cat => ({ id: cat, label: formatCategoryLabel(cat) })),
  ]
})

const activeDistrictName = computed<string>(() =>
  mapStore.selectedDistrict
    ? mapStore.selectedDistrict.charAt(0).toUpperCase() + mapStore.selectedDistrict.slice(1)
    : 'Cyprus'
)

const stripHtml = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerText.replace(/\n+/g, ' ').trim()
}

const filteredLocations = computed<Article[]>(() =>
  articleStore.items.filter(loc => {
    const matchDistrict = !mapStore.selectedDistrict || loc.district === mapStore.selectedDistrict
    const matchCategory = activeFilter.value === 'all' || loc.category === activeFilter.value
    return matchDistrict && matchCategory
  })
)

const resetFilters = (): void => {
  activeFilter.value = 'all'
  mapStore.setSelectedDistrict(null)
}

const handleAction = (loc: Article): void => {
  loc.affiliate_url
    ? window.open(loc.affiliate_url, '_blank')
    : router.push(`/article/${loc.slug}`)
}
</script>

<style scoped>
/* --- Mobile-first base --- */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100vw;
  background-color: #f8f6f0;
}

.map-section {
  height: 45dvh;
  min-height: 280px;
  background-color: #fdfcf8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-section {
  flex: 1;
  background-color: #f8f6f0;
  overflow-y: auto;
  padding: 20px 16px;
  border-radius: 20px 20px 0 0;
  margin-top: -20px;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.08);
}

/* --- Filter pills: scroll without clipping --- */
.filter-row {
  display: flex;
  gap: 8px;
  /* Extend to edges so pills aren't clipped by content padding */
  margin: 0 -16px 16px;
  padding: 0 16px 12px;
  overflow-x: auto;
  /* Momentum scrolling on iOS */
  -webkit-overflow-scrolling: touch;
  /* Always reserve scroll space so layout doesn't shift */
  scrollbar-width: none;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  flex-shrink: 0; /* Prevents pills squishing instead of scrolling */
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  white-space: nowrap;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.filter-pill.active {
  background: #c69f4b;
  color: white;
  border-color: #c69f4b;
}

/* --- Results header --- */
.results-header {
  margin: 0 0 16px;
  font-size: 1rem;
  color: #1a1a1a;
}

/* --- States --- */
.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
}

.empty-state button {
  margin-top: 12px;
  background: #1c2a32;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}

/* --- Card grid --- */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding-bottom: 40px;
}

.location-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background-color: #eee;
  transition: transform 0.4s ease;
}

.location-card:hover .card-img {
  transform: scale(1.05);
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

.card-footer small {
  text-transform: capitalize;
  color: #999;
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

/* --- Desktop --- */
@media (min-width: 1024px) {
  .app-container {
    flex-direction: row;
    height: 100dvh;
    overflow: hidden;
  }

  .map-section {
    flex: 0 0 50%;
    height: 100dvh;
    padding-top: 68px;
    min-height: unset;
  }

  .content-section {
    flex: 0 0 50%;
    height: 100dvh;
    border-radius: 0;
    margin-top: 0;
    padding: 30px;
    padding-top: 88px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  }

  .filter-row {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
