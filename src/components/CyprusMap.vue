<template>
  <div class="map-content-area">
    <svg
      viewBox="0 0 700 400"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      class="map-svg"
      :class="{ 'has-selection': mapStore.selectedDistrict }"
      @click.self="mapStore.setSelectedDistrict(null)"
    >
      <path
        v-for="(pathData, id) in districts"
        :key="id"
        :id="id"
        :d="pathData"
        class="district"
        :class="{ active: mapStore.selectedDistrict === id }"
        @click="selectDistrictGuarded(id)"
      />
    </svg>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore';
import { districts } from '@/data/districts';
import { nextTick } from 'vue';

const mapStore = useMapStore();

const selectDistrict = (id) => {
  const isSame = mapStore.selectedDistrict === id;

  if (isSame) {
    mapStore.setSelectedDistrict(null);
  } else {
    mapStore.setSelectedDistrict(id);
  }
};

let lastCallTime = 0;
let lastCallId = null;

const selectDistrictGuarded = (id) => {
  const now = Date.now();
  const timeSinceLast = now - lastCallTime;

  if (lastCallId === id && timeSinceLast < 400) {
    lastCallTime = now;
    lastCallId = id;
    return;
  }

  lastCallTime = now;
  lastCallId = id;
  selectDistrict(id);
};
</script>

<style scoped>
.map-content-area {
  width: 100%;
  height: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.map-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.3));
}

.district {
  fill: #cbd5e1;
  stroke: #94a3b8;
  stroke-width: 1;
  transition: fill 0.3s ease, opacity 0.3s ease, stroke-width 0.3s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.district:focus {
  outline: none;
}

@media (hover: hover) {
  .district:hover:not(.active) {
    fill: #b57b52;
  }
}

.district.active {
  fill: #b57b52;
  stroke: #8d5d3a;
  stroke-width: 2.5;
  opacity: 1;
}

/* Replaced :has() with a direct parent class Vue controls */
.map-svg.has-selection .district:not(.active) {
  opacity: 0.7;
  fill: #d1d5db;
  stroke: rgba(148, 163, 184, 0.5);
}

.map-svg:not(.has-selection) .district {
  fill: #cbd5e1;
  opacity: 1;
}
</style>