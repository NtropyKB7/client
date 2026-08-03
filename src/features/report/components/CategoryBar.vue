<script setup>
defineProps({
  label: { type: String, required: true },
  percent: { type: Number, required: true },
  colorClass: { type: String, required: true },
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between text-caption">
      <p class="font-medium text-grey-500">{{ label }}</p>
      <p class="text-grey-300">{{ percent }}%</p>
    </div>
    <div class="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-grey-100">
      <div class="h-full rounded-full" :class="colorClass" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
