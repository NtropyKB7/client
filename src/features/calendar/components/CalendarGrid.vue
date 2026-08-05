<!-- src/features/calendar/components/CalendarGrid.vue -->
<script setup>
import CalendarCell from './CalendarCell.vue'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'

defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  cells: { type: Array, required: true },
})

const emit = defineEmits(['prev-month', 'next-month', 'select'])

const WEEKDAYS = [
  { label: '일', class: 'text-red-500' },
  { label: '월', class: 'text-grey-400' },
  { label: '화', class: 'text-grey-400' },
  { label: '수', class: 'text-grey-400' },
  { label: '목', class: 'text-grey-400' },
  { label: '금', class: 'text-grey-400' },
  { label: '토', class: 'text-blue-500' },
]

const SETTLEMENT_LEGEND = [
  { label: '정산완료', dotClass: 'bg-primary-500' },
  { label: '정산예정', dotClass: 'bg-amber-400' },
  { label: '방어모드', dotClass: 'bg-rose-400' },
]
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-center gap-4">
      <button type="button" aria-label="이전 달" @click="emit('prev-month')">
        <ChevronLeftIcon class="size-5 text-grey-400" />
      </button>
      <p class="text-body1 text-grey-500">{{ year }}년 {{ month }}월</p>
      <button type="button" aria-label="다음 달" @click="emit('next-month')">
        <ChevronRightIcon class="size-5 text-grey-400" />
      </button>
    </div>

    <div class="mt-2 flex flex-wrap justify-end gap-2.5 text-caption text-grey-400">
      <span v-for="item in SETTLEMENT_LEGEND" :key="item.label" class="flex items-center gap-1">
        <span class="size-1.5 rounded-full" :class="item.dotClass" />
        {{ item.label }}
      </span>
    </div>

    <div class="mt-3 grid grid-cols-7 text-center text-caption">
      <span v-for="day in WEEKDAYS" :key="day.label" :class="day.class">{{ day.label }}</span>
    </div>
    <div class="mt-2 grid grid-cols-7 gap-1">
      <CalendarCell
        v-for="(cell, index) in cells"
        :key="cell ? cell.dateKey : `empty-${index}`"
        :cell="cell"
        @select="emit('select', cell.date)"
      />
    </div>
  </div>
</template>
