<script setup>
import { onMounted } from 'vue';
import { useGlobalStore } from './stores/global';
import { useLayout } from './layout/composables/layout';
import Preloader from './views/pages/auth/Preloader.vue';

const globalStore = useGlobalStore();
const { initializeTheme } = useLayout();

onMounted(() => {
  // Initialize theme configuration from localStorage
  initializeTheme();
  
  if (!globalStore.isLoaded) {
    // setTimeout(() => {
      globalStore.checkLoginState()
    // }, 100)

  }
})
</script>

<template>
  <router-view v-if="globalStore.isLoaded && (!globalStore.isLogin || (globalStore.loginAccount && globalStore.loginAccount.account))" />
  <div v-else>
    <Preloader></Preloader>
  </div>
</template>
