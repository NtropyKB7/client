<script setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { getCategoryColor } from '@/shared/utils/jobCategory'
import { fetchCategories } from '@/features/onboarding/api'
import DeleteJobConfirmModal from '@/shared/components/DeleteJobConfirmModal.vue'
import JobFormModal from './JobFormModal.vue'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['save', 'delete'])

const modalStore = useModalStore()

const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })

const categoryColor = computed(() => getCategoryColor(props.job.categoryId))
const categoryLabel = computed(
  () =>
    props.job.categoryName ??
    categories.value?.find((category) => category.categoryId === props.job.categoryId)?.name ??
    '기타',
)
const platformNames = computed(
  () => props.job.platforms?.map((platform) => platform.platformName).join(', ') ?? '',
)
const sourceLine = computed(() =>
  props.job.isRegular
    ? `${categoryLabel.value} · 주 ${props.job.workDays.length}회`
    : `${categoryLabel.value} · 비정기`,
)

// 잡 후보(candidate)를 실제 잡으로 확정할 때 쓸 시드 draft. categoryId/platformIds만 채워두고
// jobName·임금·근무스케줄은 사용자가 JobFormModal에서 직접 입력한다.
function candidateSeed() {
  return {
    id: `candidate-${props.job.categoryId}`,
    name: '',
    incomeMethodLabel: '건당 정산',
    incomeAmount: 0,
    fatigue: 3,
    isRegular: false,
    workDays: [],
    startTime: '',
    endTime: '',
    categoryId: props.job.categoryId,
    platformIds: (props.job.platforms ?? []).map((platform) => platform.platformId),
  }
}

async function openEdit() {
  const seed = props.job.confirmed ? props.job : candidateSeed()
  const updated = await modalStore.open(
    JobFormModal,
    {
      mode: props.job.confirmed ? 'edit' : 'add',
      job: seed,
      title: props.job.confirmed ? null : '이 잡의 정보를 입력해 주세요',
    },
    { position: 'bottom' },
  )
  if (updated) {
    emit('save', updated)
  }
}

async function requestDelete() {
  const confirmed = await modalStore.open(DeleteJobConfirmModal, {}, { position: 'center' })
  if (confirmed) {
    emit('delete')
  }
}
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-[18px] border p-4 transition-colors"
    :class="job.confirmed ? 'border-primary-500 bg-primary-50' : 'border-grey-50 bg-grey-white'"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-xl text-body3 font-bold text-white"
      :class="categoryColor.colorClass"
    >
      {{ (job.confirmed ? job.name : categoryLabel).charAt(0) }}
    </span>

    <div v-if="job.confirmed" class="min-w-0 flex-1">
      <p class="truncate text-body1 text-grey-500">{{ job.name }}</p>
      <p class="mt-0.5 truncate text-caption text-grey-400">{{ sourceLine }}</p>
      <p class="mt-1 text-body3 font-bold text-primary-800">
        +{{ job.incomeAmount.toLocaleString() }}원
      </p>
    </div>

    <div v-else class="min-w-0 flex-1">
      <p class="truncate text-body1 text-grey-500">{{ categoryLabel }}</p>
      <p class="mt-0.5 truncate text-caption text-grey-400">{{ platformNames }}</p>
      <p class="mt-1 text-body3 font-bold text-grey-400">
        입금 {{ job.settlementCount }}건 · 총 {{ job.totalAmount.toLocaleString() }}원
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-2.5">
      <template v-if="job.confirmed">
        <button
          type="button"
          class="text-caption font-medium text-grey-400 underline"
          @click="openEdit"
        >
          수정
        </button>
        <button
          type="button"
          class="rounded-[10px] border border-grey-50 bg-grey-white px-3 py-1.5 text-caption font-medium text-grey-400"
          @click="requestDelete"
        >
          삭제
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="text-caption font-medium text-grey-400 underline"
          @click="requestDelete"
        >
          아니에요
        </button>
        <button
          type="button"
          class="rounded-[10px] bg-primary-50 px-3 py-1.5 text-caption font-medium text-primary-800"
          @click="openEdit"
        >
          내 잡이 맞아요
        </button>
      </template>
    </div>
  </div>
</template>
