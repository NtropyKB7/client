<!-- src/features/mypage/components/SectionHeader.vue -->
<script setup>
import BackLink from './BackLink.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})

defineEmits(['back'])
</script>

<template>
  <div>
    <BackLink @click="$emit('back')" />
    <h2 class="mt-3 text-center text-lg font-bold text-[#111110]">{{ title }}</h2>
    <p v-if="description" class="mt-1 text-center text-xs text-[#6B6A65]">{{ description }}</p>
  </div>
</template>
