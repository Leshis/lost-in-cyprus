<template>
  <div class="map-content-area">
    <svg
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
        :style="getPathStyle(id)"
        @click="selectDistrictGuarded(id)"
      />
    </svg>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore';
import { districts } from '@/data/districts';

const mapStore = useMapStore();

const COLORS = {
  default: '#cbd5e1',
  active: '#b57b52',
  dimmed: '#d1d5db',
};

const getPathStyle = (id) => {
  const selected = mapStore.selectedDistrict;

  if (!selected) {
    return {
      fill: COLORS.default,
      stroke: '#94a3b8',
      strokeWidth: '1',
      opacity: '1',
    };
  }

  if (selected === id) {
    return {
      fill: COLORS.active,
      stroke: '#8d5d3a',
      strokeWidth: '2.5',
      opacity: '1',
    };
  }

  return {
    fill: COLORS.dimmed,
    stroke: 'rgba(148, 163, 184, 0.5)',
    strokeWidth: '1',
    opacity: '0.7',
  };
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

@media (hover: hover) {
  .district:hover {
    fill: #b57b52 !important;
  }
}
</style>