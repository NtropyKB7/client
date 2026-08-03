<script setup>
import BottomTabBar from './BottomTabBar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <main class="flex-1 overflow-y-auto pb-[84px]">
      <router-view />
    </main>
    <BottomTabBar />
  </div>
</template>
