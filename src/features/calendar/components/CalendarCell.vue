<!-- src/features/calendar/components/CalendarCell.vue -->
<script setup>
import { getJobCategory } from '@/shared/utils/jobCategory'

defineProps({
  cell: { type: Object, default: null },
})

const emit = defineEmits(['select'])

const STATUS_CAPSULE = {
  none: '',
  pending: 'bg-amber-100',
  settled: 'bg-primary-100',
  defense: 'bg-rose-200',
}
</script>

<template>
  <div v-if="!cell" />
  <button
    v-else
    type="button"
    class="relative flex flex-col items-center gap-1 rounded-[10px] py-2 text-caption"
    :class="cell.isSelected ? 'bg-primary-50' : ''"
    @click="emit('select')"
  >
    <span v-if="cell.weather" class="absolute -right-0.5 -top-0.5 text-[9px] leading-none">
      {{ cell.weather.icon }}
    </span>
    <span
      class="flex size-7 items-center justify-center rounded-full font-medium text-grey-500"
      :class="STATUS_CAPSULE[cell.status]"
    >
      {{ cell.dayNumber }}
    </span>
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
