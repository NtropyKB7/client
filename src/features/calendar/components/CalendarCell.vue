<!-- src/features/calendar/components/CalendarCell.vue -->
<script setup>
import { getJobCategory } from '@/shared/utils/jobCategory'

defineProps({
  cell: { type: Object, default: null },
})

defineEmits(['select'])

const STATUS_BG = {
  none: '',
  pending: 'bg-amber-100',
  settled: 'bg-emerald-100',
  defense: 'bg-rose-200',
}
</script>

<template>
  <div v-if="!cell" />
  <button
    v-else
    type="button"
    class="flex flex-col items-center gap-1 rounded-full py-1.5 text-sm"
    :class="[STATUS_BG[cell.status], cell.isSelected ? 'ring-2 ring-[#111110]' : '']"
    @click="$emit('select')"
  >
    <span class="font-medium text-[#111110]">{{ cell.dayNumber }}</span>
    <span class="flex h-0.5 gap-0.5">
      <span
        v-for="category in cell.categories"
        :key="category"
        class="h-0.5 w-3 rounded-full"
        :class="getJobCategory(category).colorClass"
      />
    </span>
  </button>
</template>
