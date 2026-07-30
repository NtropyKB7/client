<script setup>
defineProps({
  label: { type: String, required: true },
  percent: { type: Number, required: true },
  colorClass: { type: String, required: true },
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between text-sm text-[#111110]">
      <p>{{ label }}</p>
      <p>{{ percent }}%</p>
    </div>
    <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F1EC]">
      <div class="h-full rounded-full" :class="colorClass" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
