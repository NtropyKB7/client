<!-- src/shared/components/AppHeader.vue -->
<script setup>
import BellIcon from './icons/BellIcon.vue'
import ChevronLeftIcon from './icons/ChevronLeftIcon.vue'

defineProps({
  title: { type: String, required: true },
  back: { type: Boolean, default: false },
})

defineEmits(['back'])
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-center border-b border-grey-50 bg-grey-white px-4"
  >
    <button
      v-if="back"
      type="button"
      aria-label="뒤로가기"
      class="absolute left-4 text-grey-500"
      @click="$emit('back')"
    >
      <ChevronLeftIcon class="size-6" />
    </button>
    <h1 class="truncate text-[15px] font-bold text-grey-500">{{ title }}</h1>
    <BellIcon v-if="!back" class="absolute right-4 size-6 text-grey-500" />
  </header>
</template>
