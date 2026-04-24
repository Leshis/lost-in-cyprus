<template>
  <div class="map-content-area">
    <svg viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="map-svg"
      @click.self="mapStore.setSelectedDistrict(null)">
      <path v-for="(pathData, id) in districts" :key="id" :id="id" :d="pathData" class="district"
        :class="{ active: mapStore.selectedDistrict === id }" @click="selectDistrictGuarded(id)" />
    </svg>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore';
import { districts } from '@/data/districts';
import { nextTick } from 'vue';

const mapStore = useMapStore();

const selectDistrict = (id) => {
  const before = mapStore.selectedDistrict;
  const isSame = before === id;

  console.log(`[MapSVG] selectDistrict called`, {
    id,
    before,
    isSame,
    timestamp: Date.now(),
  });

  if (isSame) {
    console.log(`[MapSVG] → Deselecting: setSelectedDistrict(null)`);
    mapStore.setSelectedDistrict(null);

    nextTick(() => {
      const after = mapStore.selectedDistrict;
      const el = document.getElementById(id);
      const hasActiveClass = el?.classList.contains('active');

      console.log(`[MapSVG] nextTick after deselect`, {
        storeValue: after,
        elementId: id,
        hasActiveClass,
        classList: el ? [...el.classList] : null,
      });

      if (hasActiveClass) {
        console.warn(`[MapSVG] ⚠️ BUG DETECTED: element still has .active after deselect. Store is "${after}"`);
      }

      // Force browser to repaint the SVG on mobile
      const svgEl = document.querySelector('.map-svg');
      if (svgEl) {
        svgEl.style.display = 'none';
        requestAnimationFrame(() => {
          svgEl.style.display = '';
        });
      }
    });
  } else {
    console.log(`[MapSVG] → Selecting: setSelectedDistrict("${id}")`);
    mapStore.setSelectedDistrict(id);

    nextTick(() => {
      console.log(`[MapSVG] nextTick after select`, {
        storeValue: mapStore.selectedDistrict,
      });
    });
  }
};

let lastCallTime = 0;
let lastCallId = null;

const selectDistrictGuarded = (id) => {
  const now = Date.now();
  const timeSinceLast = now - lastCallTime;

  if (lastCallId === id && timeSinceLast < 400) {
    console.warn(`[MapSVG] 🚨 RAPID DOUBLE EVENT detected on "${id}" — ${timeSinceLast}ms apart. Suppressing.`);
    lastCallTime = now;
    lastCallId = id;
    return;
  }

  console.log(`[MapSVG] Event gap since last call: ${timeSinceLast}ms`);
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
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.3));
}

.district {
  fill: #cbd5e1;
  stroke: #94a3b8;
  stroke-width: 1;
  filter: none;
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

svg:has(.active) .district:not(.active) {
  opacity: 0.7;
  fill: #d1d5db;
  stroke: rgba(148, 163, 184, 0.5);
}

svg:not(:has(.active)) .district {
  fill: #cbd5e1;
  opacity: 1;
  filter: none;
}
</style>
