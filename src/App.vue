<template>
  <div id="app-container">
    <TheNavbar v-if="!shouldHideNav" @openMenu="isMenuOpen = true" />
    <TheMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" />

    <main class="main-content">
      <router-view />
    </main>

    <TheFooter v-if="!shouldHideNav" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TheNavbar from '@/components/TheNavbar.vue';
import TheMenu from '@/components/TheMenu.vue';
import TheFooter from '@/components/TheFooter.vue';

const isMenuOpen = ref(false);
const route = useRoute();

const shouldHideNav = computed(() =>
  ['Admin', 'Login', 'ArticlePreview'].includes(route.name as string)
);

watch(() => route.fullPath, () => { isMenuOpen.value = false; });

</script>

<style scoped>
#app-container {
  display: flex;              /* ← fixes the footer bounce */
  flex-direction: column;
  min-height: 100svh;
  background-color: #f8f6f0;
}

.main-content {
  flex: 1;                   /* ← pushes footer to the bottom always */
}
</style>