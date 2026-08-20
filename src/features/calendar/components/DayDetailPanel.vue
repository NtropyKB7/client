<!-- src/features/calendar/components/DayDetailPanel.vue -->
<script setup>
import Button from '@/shared/components/Button.vue'
import { getCategoryColor } from '@/shared/utils/jobCategory'

defineProps({
  dateKey: { type: String, required: true },
  entries: { type: Array, required: true },
  weather: { type: Object, default: null },
  fatigueScore: { type: Number, default: null },
  isFatigueOverThreshold: { type: Boolean, default: false },
  isDefenseMode: { type: Boolean, default: false },
  primaryActionLabel: { type: String, required: true },
})

const emit = defineEmits(['primary-action', 'open-entry'])
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-body3 text-grey-500">{{ dateKey }}</p>
      <span v-if="weather" class="rounded-full bg-grey-30 px-2 py-1 text-caption text-grey-400">
        {{ weather.icon }} {{ weather.label }}
      </span>
    </div>

    <p
      v-if="isDefenseMode"
      class="mt-3 rounded-lg bg-rose-50 px-2.5 py-2 text-caption font-medium text-rose-500"
    >
      방어모드 기간이에요
    </p>

    <p v-if="entries.length === 0" class="mt-3 text-caption text-grey-400">
      등록된 근무 계획이 없어요.
    </p>

    <button
      v-for="entry in entries"
      :key="entry.id"
      type="button"
      class="mt-2 flex w-full items-center justify-between rounded-[9px] px-2.5 py-2 text-left"
      :class="entry.status === 'CONFIRMED' ? 'bg-primary-50' : 'bg-grey-30'"
      @click="emit('open-entry', entry)"
    >
      <span class="flex items-center gap-2">
        <span
          class="flex size-5 shrink-0 items-center justify-center rounded-[6px] text-[10px] font-bold text-white"
          :class="getCategoryColor(entry.categoryId).colorClass"
        >
          {{ entry.jobName.slice(0, 1) }}
        </span>
        <span class="text-body3 text-grey-500">{{ entry.jobName }}</span>
      </span>
      <span class="text-caption text-grey-400">{{ entry.startTime }}–{{ entry.endTime }}</span>
    </button>

    <p
      v-if="fatigueScore !== null"
      class="mt-3 rounded-lg px-2.5 py-2 text-caption font-medium"
      :class="isFatigueOverThreshold ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-800'"
    >
      {{
        isFatigueOverThreshold
          ? `주의 · 피로도 ${fatigueScore}, 휴식 후 기록해 주세요`
          : `예상 피로도 ${fatigueScore} · 적정 범위예요`
      }}
    </p>

    <Button class="mt-3" @click="emit('primary-action')">{{ primaryActionLabel }}</Button>
  </div>
</template>
