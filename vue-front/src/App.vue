<script setup>
import { onMounted } from 'vue';
import { useGlobalStore } from './stores/global';
import Preloader from './views/pages/auth/Preloader.vue';


const globalStore = useGlobalStore()

onMounted(() => {
  if (!globalStore.isLoaded) {
    setTimeout(() => {
      globalStore.checkLoginState()
    }, 100)

  }
})

</script>

<template>
  <router-view v-if="globalStore.isLoaded" />
  <div v-else>
    <Preloader></Preloader>
  </div>
</template>
