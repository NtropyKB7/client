<!-- src/features/calendar/components/CalendarGrid.vue -->
<script setup>
import CalendarCell from './CalendarCell.vue'

defineProps({
  cells: { type: Array, required: true },
})

const emit = defineEmits(['select'])

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
</script>

<template>
  <div>
    <div class="grid grid-cols-7 text-center text-xs text-[#6B6A65]">
      <span v-for="day in WEEKDAYS" :key="day">{{ day }}</span>
    </div>
    <div class="mt-2 grid grid-cols-7 gap-y-2">
      <CalendarCell
        v-for="(cell, index) in cells"
        :key="cell ? cell.dateKey : `empty-${index}`"
        :cell="cell"
        @select="emit('select', cell.date)"
      />
    </div>
  </div>
</template>
