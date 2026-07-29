<!-- src/features/calendar/components/CalendarGrid.vue -->
<script setup>
import CalendarCell from './CalendarCell.vue'

defineProps({
  cells: { type: Array, required: true },
})

const emit = defineEmits(['select'])

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const STATUS_LEGEND = [
  { label: '정산 완료', dotClass: 'bg-emerald-400' },
  { label: '정산 대기 중', dotClass: 'bg-amber-400' },
  { label: '방어모드', dotClass: 'bg-rose-400' },
]
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-3 text-xs text-[#6B6A65]">
      <span v-for="item in STATUS_LEGEND" :key="item.label" class="flex items-center gap-1">
        <span class="h-2 w-2 rounded-full" :class="item.dotClass" />
        {{ item.label }}
      </span>
    </div>
    <div class="mt-3 grid grid-cols-7 text-center text-xs text-[#6B6A65]">
      <span v-for="day in WEEKDAYS" :key="day">{{ day }}</span>
    </div>
    <div class="mt-4 grid grid-cols-7 gap-1.5">
      <CalendarCell
        v-for="(cell, index) in cells"
        :key="cell ? cell.dateKey : `empty-${index}`"
        :cell="cell"
        @select="emit('select', cell.date)"
      />
    </div>
  </div>
</template>
