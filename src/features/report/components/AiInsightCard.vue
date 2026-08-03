<!-- src/features/report/components/AiInsightCard.vue -->
<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="rounded-2xl bg-primary-50 p-4">
    <span
      class="inline-block rounded-full bg-grey-white px-3 py-1.5 text-[10px] font-bold text-primary-800"
    >
      AI 인사이트
    </span>
    <p class="mt-3 text-body4 font-bold text-primary-800">{{ title }}</p>
    <p class="mt-1 text-caption text-primary-800">{{ description }}</p>
  </div>
</template>
