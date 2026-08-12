<script setup>
defineProps({
  label: { type: String, required: true },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-1 shrink-0 rounded-[2px] bg-primary-500" />
    <p class="text-[13px] font-bold text-grey-500">{{ label }}</p>
  </div>
</template>
