<template>
  <div class="map-content-area">
    <!-- Debug overlay - remove when done -->
    <div class="debug-overlay">
      <div class="debug-log" v-for="(log, i) in debugLogs" :key="i" :class="log.type">
        {{ log.msg }}
      </div>
      <button @click="debugLogs = []" class="debug-clear">Clear</button>
    </div>

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
import { ref, watch } from 'vue';

const mapStore = useMapStore();
const debugLogs = ref([]);

const log = (msg, type = 'info') => {
  const time = new Date().toISOString().slice(11, 23);
  debugLogs.value.unshift({ msg: `${time} ${msg}`, type });
  if (debugLogs.value.length > 30) debugLogs.value.pop();
};

// Watch the store value directly
watch(() => mapStore.selectedDistrict, (newVal, oldVal) => {
  log(`STORE changed: "${oldVal}" → "${newVal}"`, newVal === null ? 'warn' : 'info');

  // Check actual DOM after Vue updates
  if (oldVal) {
    setTimeout(() => {
      const el = document.getElementById(oldVal);
      const fill = el?.style.fill;
      const opacity = el?.style.opacity;
      log(`DOM check for "${oldVal}": fill=${fill} opacity=${opacity}`, fill === '#b57b52' ? 'error' : 'ok');
    }, 100);
  }
});

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
    log(`🚨 SUPPRESSED double event: "${id}" ${timeSinceLast}ms`, 'error');
    lastCallTime = now;
    lastCallId = id;
    return;
  }

  log(`TAP: "${id}" | store="${mapStore.selectedDistrict}" | gap=${timeSinceLast}ms`);
  lastCallTime = now;
  lastCallId = id;

  if (mapStore.selectedDistrict === id) {
    log(`→ Deselecting "${id}"`, 'warn');
    mapStore.setSelectedDistrict(null);
  } else {
    log(`→ Selecting "${id}"`, 'info');
    mapStore.setSelectedDistrict(id);
  }
};
</script>

<style scoped>
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-height: 40vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  padding: 8px;
  font-family: monospace;
  font-size: 11px;
}

.debug-log {
  color: #a0e0a0;
  padding: 1px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.debug-log.warn  { color: #ffd700; }
.debug-log.error { color: #ff6b6b; }
.debug-log.ok    { color: #69d469; }

.debug-clear {
  margin-top: 4px;
  padding: 4px 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
}

/* rest of your styles unchanged */
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