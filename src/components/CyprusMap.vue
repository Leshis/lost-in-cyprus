<template>
  <div class="map-content-area">
    <svg
      ref="svgEl"
      :viewBox="viewBox"
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
        :class="['district', getDistrictClass(id)]"
        @click="selectDistrictGuarded(id)"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { districts } from '@/data/districts';

const mapStore = useMapStore();
const svgEl = ref(null);
const viewBox = ref('0 0 700 400');

onMounted(async () => {
  await nextTick();

  const svg = svgEl.value;
  if (!svg) return;

  const bbox = svg.getBBox();
  if (!bbox.width || !bbox.height) return;

  const padding = 20;
  viewBox.value = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
});

const getDistrictClass = (id) => {
  const selected = mapStore.selectedDistrict;
  if (!selected) return 'district-default';
  if (selected === id) return 'district-active';
  return 'district-dimmed';
};

let lastCallTime = 0;
let lastCallId = null;

const selectDistrictGuarded = (id) => {
  const now = Date.now();

  if (lastCallId === id && now - lastCallTime < 100) {
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
  transition: fill 0.3s ease, opacity 0.3s ease, stroke-width 0.3s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.district:focus {
  outline: none;
}

.district-default {
  fill: #cbd5e1;
  stroke: #94a3b8;
  stroke-width: 1;
  opacity: 1;
}

.district-active {
  fill: #b57b52;
  stroke: #8d5d3a;
  stroke-width: 2.5;
  opacity: 1;
}

.district-dimmed {
  fill: #d1d5db;
  stroke: rgba(148, 163, 184, 0.5);
  stroke-width: 1;
  opacity: 0.7;
}

@media (hover: hover) and (pointer: fine) {
  .district:hover {
    fill: #b57b52;
  }
}
</style>