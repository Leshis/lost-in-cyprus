<template>
  <div id="app-container">
    <TheNavbar v-if="!shouldHideNav" @openMenu="isMenuOpen = true" />
    <TheMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" @navigate="handleNavigation" />

    <main class="main-content">
      <router-view />
    </main>

    <TheFooter v-if="!shouldHideNav" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheNavbar from '@/components/TheNavbar.vue';
import TheMenu from '@/components/TheMenu.vue';
import TheFooter from '@/components/TheFooter.vue';
import { useArticleStore } from '@/stores/articleStore';

const isMenuOpen = ref(false);
const router = useRouter();
const route = useRoute();
const articleStore = useArticleStore();

const shouldHideNav = computed(() =>
  ['Admin', 'Login'].includes(route.name as string) ||
  ['/gate', '/login'].includes(route.path)
);

onMounted(() => articleStore.fetchArticles());

watch(() => route.path, () => { isMenuOpen.value = false; });

const handleNavigation = (target: string | object) => {
  isMenuOpen.value = false;
  router.push(typeof target === 'object' ? target : `/article/${target}`);
};
</script>

<style scoped>
#app-container {
  display: flex;              /* ← fixes the footer bounce */
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f6f0;
}

.main-content {
  flex: 1;                   /* ← pushes footer to the bottom always */
}
</style>