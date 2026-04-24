<script setup>
import { useMapStore } from '@/stores/mapStore';
import { districts } from '@/data/districts';
import { watch } from 'vue';

const mapStore = useMapStore();

const COLORS = {
  default: '#cbd5e1',
  active: '#b57b52',
  dimmed: '#d1d5db',
};

// Directly set SVG attributes — bypasses Vue rendering and GPU cache entirely
const repaintAll = (selectedId) => {
  Object.keys(districts).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (!selectedId) {
      el.setAttribute('fill', COLORS.default);
      el.setAttribute('stroke', '#94a3b8');
      el.setAttribute('stroke-width', '1');
      el.setAttribute('opacity', '1');
    } else if (id === selectedId) {
      el.setAttribute('fill', COLORS.active);
      el.setAttribute('stroke', '#8d5d3a');
      el.setAttribute('stroke-width', '2.5');
      el.setAttribute('opacity', '1');
    } else {
      el.setAttribute('fill', COLORS.dimmed);
      el.setAttribute('stroke', 'rgba(148,163,184,0.5)');
      el.setAttribute('stroke-width', '1');
      el.setAttribute('opacity', '0.7');
    }
  });
};

watch(
  () => mapStore.selectedDistrict,
  (newVal) => {
    // Double rAF forces browser to actually commit the repaint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        repaintAll(newVal);
      });
    });
  }
);

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

  if (mapStore.selectedDistrict === id) {
    mapStore.setSelectedDistrict(null);
  } else {
    mapStore.setSelectedDistrict(id);
  }
};
</script>

<template>
  <div class="map-content-area">
    <svg
  :key="String(mapStore.selectedDistrict)"
  viewBox="0 0 700 400"
  preserveAspectRatio="xMidYMid meet"
  xmlns="http://www.w3.org/2000/svg"
  class="map-svg"
  @click.self="mapStore.setSelectedDistrict(null)"
>
      <path
        v-for="(pathData, id) in districts"
        :key="id"
        :id="id"
        :d="pathData"
        class="district"
        @click="selectDistrictGuarded(id)"
      />
    </svg>
  </div>
</template>

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
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  /* No transition - instant update is more reliable on mobile */
}

@media (hover: hover) {
  .district:hover {
    fill: #b57b52;
  }
}
</style>