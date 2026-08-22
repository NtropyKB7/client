<!-- src/features/defense-mode/components/DeclarationForm.vue -->
<script setup>
import { computed, ref } from 'vue'
import Button from '@/shared/components/Button.vue'
import DatePicker from '@/shared/components/DatePicker.vue'
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'
import { formatDateKey } from '../utils'

defineProps({
  causes: { type: Array, required: true },
})

const emit = defineEmits(['activate'])

const selectedCause = ref(null)
const startDate = ref('')
const endDate = ref('')

// 종료일이 시작일보다 앞설 수 없다 — DatePicker의 min-date로 애초에 못 고르게 막고, 시작일을
// 나중에 바꿔 기존 종료일이 그보다 앞서게 되면 여기서 다시 걸러 제출을 막는다.
const isRangeValid = computed(
  () => !startDate.value || !endDate.value || endDate.value >= startDate.value,
)
const isValid = computed(
  () => selectedCause.value && startDate.value && endDate.value && isRangeValid.value,
)
const isFutureStart = computed(
  () => !!startDate.value && startDate.value > formatDateKey(new Date()),
)
const submitLabel = computed(() => (isFutureStart.value ? '방어모드 예약하기' : '방어모드 진입'))

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
  <div class="flex flex-col gap-4">
    <div class="rounded-2xl border border-grey-50 bg-grey-white p-5">
      <div class="flex flex-col items-center gap-2 text-center">
        <span class="flex size-11 items-center justify-center rounded-full bg-primary-50">
          <DefenseIcon class="size-6 text-primary-600" />
        </span>
        <h2 class="text-head3 text-grey-500">근무불가 선언</h2>
        <p v-if="!selectedCause" class="text-caption text-grey-300">
          근무가 중단된 경우 선언하면<br />방어모드가 활성화됩니다.
        </p>
        <p v-else class="text-caption text-grey-300">사유와 예상 중단 기간을 확인해 주세요.</p>
      </div>

      <p class="mt-6 text-caption font-bold text-grey-500">
        중단 사유{{ selectedCause ? '' : '를 선택해 주세요' }}
      </p>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <button
          v-for="option in causes"
          :key="option.causeCode"
          type="button"
          class="rounded-xl border py-2.5 text-caption font-bold"
          :class="
            selectedCause === option.causeCode
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-grey-50 bg-grey-30 text-grey-500'
          "
          @click="selectCause(option.causeCode)"
        >
          {{ option.causeName }}
        </button>
      </div>

      <div v-if="selectedCause" class="mt-4 flex flex-col gap-3">
        <div>
          <p class="text-caption font-bold text-grey-300">시작일</p>
          <div class="mt-1.5">
            <DatePicker v-model="startDate" placeholder="시작일을 선택해 주세요" />
          </div>
        </div>
        <div>
          <p class="text-caption font-bold text-grey-300">종료일</p>
          <div class="mt-1.5">
            <DatePicker
              v-model="endDate"
              placeholder="종료일을 선택해 주세요"
              :min-date="startDate"
            />
          </div>
          <p v-if="!isRangeValid" class="mt-1.5 text-caption text-[#eb3326]">
            종료일은 시작일 이후여야 해요.
          </p>
        </div>
      </div>

      <div v-if="selectedCause" class="mt-4">
        <Button :disabled="!isValid" @click="submit">{{ submitLabel }}</Button>
      </div>
    </div>

    <div v-if="selectedCause" class="rounded-2xl border border-grey-50 bg-grey-white p-4">
      <p class="text-caption font-bold text-[#eb3326]">진입 전 확인</p>
      <p class="mt-2 text-[11px] text-grey-300">
        기간 동안 신규 근무 추천은 잠시 멈추고 생존 플랜과 필수 지출 관리가 우선됩니다.
      </p>
    </div>
  </div>
</template>
