<template>
  <div class="search-section">
    <div v-if="!isSearching" @click="isSearching = true" class="pill-search-btn">
      <span class="search-icon">🔍</span> SEARCH
    </div>

    <div v-else class="search-input-wrapper">
      <input 
        v-model="searchQuery" 
        @input="handleSearch" 
        placeholder="Search secrets..." 
        autofocus
        class="search-field" 
      />

      <div class="results-dropdown" v-if="searchResults.length > 0">
        <div 
          v-for="result in searchResults" 
          :key="result.id" 
          class="result-item" 
          @click="emit('select', result.id)"
        >
          <div class="result-thumb-wrapper">
            <img :src="getImageUrl(result.image_url)" class="result-thumb" alt="Thumbnail" />
          </div>
          <span class="result-title">{{ result.title }}</span>
        </div>
      </div>

      <button class="cancel-search" @click="isSearching = false">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/supabase';
import { getImageUrl } from '@/utils/supabaseHelpers';

const emit = defineEmits(['select']);
const isSearching = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
let searchTimeout = null;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    const { data } = await supabase
      .from('articles')
      .select('id, title, image_url, slug')
      .ilike('title', `%${searchQuery.value}%`)
      .limit(5);
    searchResults.value = data || [];
  }, 300);
};
</script>

<style scoped>
.search-section {
  width: 100%;
  margin-top: 10px;
}

.pill-search-btn {
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  max-height: 250px;
  overflow-y: auto;
  margin-top: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.result-thumb-wrapper {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
}

.result-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1c2a32;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cancel-search {
  background: none;
  border: none;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
}
</style>