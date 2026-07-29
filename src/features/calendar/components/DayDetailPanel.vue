<!-- src/features/calendar/components/DayDetailPanel.vue -->
<script setup>
import { getEntryStatusBadge } from '../utils'
import Button from '@/shared/components/Button.vue'

defineProps({
  dateKey: { type: String, required: true },
  entries: { type: Array, required: true },
  weather: { type: Object, default: null },
  fatigueScore: { type: Number, default: null },
  fatigueThreshold: { type: Number, required: true },
})

const emit = defineEmits(['add-plan', 'edit-entry', 'confirm-entry'])
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-[#111110]">{{ dateKey }}</p>
      <span v-if="weather" class="rounded-full bg-[#F3F1EC] px-2 py-1 text-xs text-[#6B6A65]">
        {{ weather.icon }} {{ weather.label }}
      </span>
    </div>

    <p v-if="entries.length === 0" class="mt-3 text-xs text-[#6B6A65]">
      등록된 근무 계획이 없어요.
    </p>

    <div
      v-for="entry in entries"
      :key="entry.id"
      class="mt-3 flex items-center justify-between border-b border-[#111110]/5 pb-2 last:border-b-0"
    >
      <div>
        <p class="text-sm text-[#111110]">
          {{ entry.jobName }} {{ entry.startTime }}–{{ entry.endTime }}
        </p>
        <span
          class="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
          :class="getEntryStatusBadge(entry.status).className"
        >
          {{ getEntryStatusBadge(entry.status).label }}
        </span>
      </div>
      <div class="flex shrink-0 gap-2 text-xs">
        <button
          v-if="entry.status !== 'settled'"
          type="button"
          class="text-[#6B6A65] underline"
          @click="emit('edit-entry', entry)"
        >
          수정하기
        </button>
        <button
          v-if="entry.status === 'planned'"
          type="button"
          class="text-[#E0B400] underline"
          @click="emit('confirm-entry', entry)"
        >
          확정하기
        </button>
      </div>
    </div>

    <p
      v-if="fatigueScore !== null"
      class="mt-3 text-xs"
      :class="fatigueScore > fatigueThreshold ? 'text-red-600' : 'text-[#6B6A65]'"
    >
      예상 피로도 {{ fatigueScore }} ({{ fatigueScore > fatigueThreshold ? '높음' : '보통' }}) ·
      적정선 {{ fatigueThreshold }} {{ fatigueScore > fatigueThreshold ? '초과' : '이내' }}
    </p>

    <Button class="mt-3" variant="outline" @click="emit('add-plan')">근무 계획 추가</Button>
  </div>
</template>
