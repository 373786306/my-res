<template>
  <div class="h-screen">
    <header class="text-center">
      <nav>
        <Header />
      </nav>
    </header>
    <main class="pt-4 h-[90%]">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">

import Header from './components/Header.vue'


</script>

<style scoped>

</style>