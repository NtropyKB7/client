<!-- src/features/calendar/components/TimePickerField.vue -->
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '시간 선택' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const fieldRef = ref(null)

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
// 5분 단위로 제한 — 근무 시간 입력에 충분한 정밀도이며 선택지 수를 관리 가능한 수준으로 유지한다.
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

const hourValue = computed(() => props.modelValue.split(':')[0] ?? '')
const minuteValue = computed(() => props.modelValue.split(':')[1] ?? '')

function selectHour(hour) {
  emit('update:modelValue', `${hour}:${minuteValue.value || '00'}`)
}

function selectMinute(minute) {
  emit('update:modelValue', `${hourValue.value || '00'}:${minute}`)
}

function handleOutsideClick(event) {
  if (fieldRef.value && !fieldRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div ref="fieldRef" class="relative">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3 text-left text-body4"
      @click="isOpen = !isOpen"
    >
      <span :class="modelValue ? 'text-grey-500' : 'text-grey-300'">
        {{ modelValue || placeholder }}
      </span>
      <ChevronDownIcon
        class="size-4 shrink-0 text-grey-400 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1.5 flex w-full divide-x divide-grey-50 rounded-2xl border border-grey-50 bg-grey-white shadow-lg"
    >
      <div class="max-h-40 flex-1 overflow-y-auto p-1.5">
        <button
          v-for="hour in HOURS"
          :key="hour"
          type="button"
          class="block w-full rounded-lg px-2 py-1.5 text-center text-body4"
          :class="hourValue === hour ? 'bg-primary-50 text-primary-800' : 'text-grey-500'"
          @click="selectHour(hour)"
        >
          {{ hour }}
        </button>
      </div>
      <div class="max-h-40 flex-1 overflow-y-auto p-1.5">
        <button
          v-for="minute in MINUTES"
          :key="minute"
          type="button"
          class="block w-full rounded-lg px-2 py-1.5 text-center text-body4"
          :class="minuteValue === minute ? 'bg-primary-50 text-primary-800' : 'text-grey-500'"
          @click="selectMinute(minute)"
        >
          {{ minute }}
        </button>
      </div>
    </div>
  </div>
</template>
