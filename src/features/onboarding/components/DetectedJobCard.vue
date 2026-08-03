<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { getJobCategory } from '@/shared/utils/jobCategory'
import DeleteJobConfirmModal from '@/shared/components/DeleteJobConfirmModal.vue'
import JobFormModal from './JobFormModal.vue'

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['save', 'delete', 'confirm'])

const modalStore = useModalStore()

const category = computed(() => getJobCategory(props.job.category))
const sourceLine = computed(() =>
  props.job.isRegular
    ? `${category.value.label} · 주 ${props.job.workDays.length}회`
    : `${category.value.label} · 비정기`,
)

async function openEdit() {
  const updated = await modalStore.open(
    JobFormModal,
    { mode: 'edit', job: props.job },
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
      :class="category.colorClass"
    >
      {{ job.name.charAt(0) }}
    </span>

    <div class="min-w-0 flex-1">
      <p class="truncate text-body1 text-grey-500">{{ job.name }}</p>
      <p class="mt-0.5 truncate text-caption text-grey-400">{{ sourceLine }}</p>
      <p
        class="mt-1 text-body3 font-bold"
        :class="job.confirmed ? 'text-primary-800' : 'text-grey-400'"
      >
        +{{ job.incomeAmount.toLocaleString() }}원
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-2.5">
      <button
        type="button"
        class="text-caption font-medium text-grey-400 underline"
        @click="openEdit"
      >
        수정
      </button>
      <button
        v-if="job.confirmed"
        type="button"
        class="rounded-[10px] border border-grey-50 bg-grey-white px-3 py-1.5 text-caption font-medium text-grey-400"
        @click="requestDelete"
      >
        삭제
      </button>
      <button
        v-else
        type="button"
        class="rounded-[10px] bg-primary-50 px-3 py-1.5 text-caption font-medium text-primary-800"
        @click="emit('confirm')"
      >
        확인
      </button>
    </div>
  </div>
</template>
