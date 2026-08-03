<!-- src/shared/components/AppHeader.vue -->
<script setup>
import BellIcon from './icons/BellIcon.vue'

defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-center border-b border-grey-50 bg-grey-white px-4"
  >
    <h1 class="truncate text-[15px] font-bold text-grey-500">{{ title }}</h1>
    <BellIcon class="absolute right-4 size-6 text-grey-500" />
  </header>
</template>
