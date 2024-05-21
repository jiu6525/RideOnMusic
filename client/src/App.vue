<script setup>
import { RouterLink, RouterView } from 'vue-router'
import VHeader from './components/common/VHeader.vue';

</script>

<template>
  <header>
      <VHeader/>
  </header>

  <RouterView/>
</template>

<style scoped>
@import "/src/assets/css/common.css"
</style>