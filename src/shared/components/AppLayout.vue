<script setup>
import BottomTabBar from './BottomTabBar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F3F1EC]">
    <main class="flex-1 overflow-y-auto pb-[74px]">
      <router-view />
    </main>
    <BottomTabBar />
  </div>
</template>
