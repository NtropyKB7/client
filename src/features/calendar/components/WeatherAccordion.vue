<!-- src/features/calendar/components/WeatherAccordion.vue -->
<script setup>
import { computed, ref } from 'vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'

const props = defineProps({
  weatherByDate: { type: Object, required: true },
})

const isOpen = ref(false)

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function weekdayLabel(dateKey) {
  return WEEKDAY_LABELS[new Date(dateKey).getDay()]
}

// weatherByDate가 이미 최근 1주일 안팎의 항목만 담고 있다고 가정한다(정렬 후 상위 7개만 사용).
const days = computed(() =>
  Object.entries(props.weatherByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 7)
    .map(([dateKey, weather]) => ({ dateKey, weekday: weekdayLabel(dateKey), ...weather })),
)

const rangeLabel = computed(() => {
  if (days.value.length === 0) return ''
  const format = (dateKey) => {
    const [, month, day] = dateKey.split('-')
    return `${Number(month)}/${Number(day)}`
  }
  return `${format(days.value[0].dateKey)}–${format(days.value[days.value.length - 1].dateKey)}`
})

const highlightDay = computed(
  () => days.value.find((day) => day.label?.includes('할증')) ?? days.value[0] ?? null,
)
</script>

<template>
  <div v-if="days.length > 0" class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <button
      type="button"
      class="flex w-full items-center justify-between text-left"
      @click="isOpen = !isOpen"
    >
      <div>
        <p class="text-body3 text-grey-500">이번 주 날씨</p>
        <p v-if="highlightDay" class="mt-1 text-caption text-grey-400">
          {{ highlightDay.weekday }}요일 {{ highlightDay.icon }} {{ highlightDay.label }}
        </p>
      </div>
      <span class="flex shrink-0 items-center gap-1.5">
        <span v-if="rangeLabel" class="text-caption text-grey-400">{{ rangeLabel }}</span>
        <ChevronDownIcon
          class="size-4 shrink-0 text-grey-400 transition-transform"
          :class="isOpen ? 'rotate-180' : ''"
        />
      </span>
    </button>

    <div v-if="isOpen" class="mt-3 flex justify-between gap-1 border-t border-grey-50 pt-3">
      <div v-for="day in days" :key="day.dateKey" class="flex flex-1 flex-col items-center gap-1">
        <span class="text-caption text-grey-400">{{ day.weekday }}</span>
        <span class="text-body3">{{ day.icon }}</span>
      </div>
    </div>

    <p
      v-if="isOpen && highlightDay"
      class="mt-3 rounded-lg bg-primary-50 px-2.5 py-2 text-caption text-primary-800"
    >
      {{ highlightDay.weekday }}요일 {{ highlightDay.label }}
    </p>
  </div>
</template>
