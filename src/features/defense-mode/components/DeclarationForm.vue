<!-- src/features/defense-mode/components/DeclarationForm.vue -->
<script setup>
import { computed, ref } from 'vue'
import Button from '@/shared/components/Button.vue'
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'
import { CAUSE_OPTIONS } from '../api'

const emit = defineEmits(['activate'])

const selectedCause = ref(null)
const startDate = ref('')
const endDate = ref('')

const isValid = computed(() => selectedCause.value && startDate.value && endDate.value)

function selectCause(id) {
  selectedCause.value = id
}

function submit() {
  if (!isValid.value) return
  emit('activate', {
    cause: selectedCause.value,
    startDate: startDate.value,
    endDate: endDate.value,
  })
}
</script>

<template>
  <div class="rounded-2xl border border-[#111110]/10 bg-white p-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <DefenseIcon class="h-8 w-8 text-[#111110]" />
      <h2 class="text-base font-semibold text-[#111110]">근무불가 선언</h2>
      <p class="text-xs text-[#6B6A65]">
        근무가 중단된 경우 선언하면<br />방어모드가 활성화됩니다.
      </p>
    </div>

    <p class="mt-6 text-xs text-[#6B6A65]">원인 선택</p>
    <div class="mt-2 grid grid-cols-3 gap-2">
      <button
        v-for="option in CAUSE_OPTIONS"
        :key="option.id"
        type="button"
        class="rounded-lg py-2 text-sm font-medium"
        :class="
          selectedCause === option.id ? 'bg-rose-600 text-white' : 'bg-[#F3F1EC] text-[#111110]'
        "
        @click="selectCause(option.id)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="selectedCause" class="mt-4 grid grid-cols-2 gap-2">
      <label class="block text-xs text-[#6B6A65]">
        시작 일
        <input
          v-model="startDate"
          type="date"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
      <label class="block text-xs text-[#6B6A65]">
        종료 일
        <input
          v-model="endDate"
          type="date"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
    </div>

    <div v-if="selectedCause" class="mt-4">
      <Button variant="danger" :disabled="!isValid" @click="submit">방어모드 진입</Button>
    </div>
  </div>
</template>
