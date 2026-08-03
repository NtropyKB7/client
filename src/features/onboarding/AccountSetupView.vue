<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from './store'
import { useModalStore } from '@/shared/store/modal'
import BankPickerModal from './components/BankPickerModal.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const modalStore = useModalStore()

const accountForms = ref(
  onboardingStore.accounts.length > 0
    ? onboardingStore.accounts.map((a) => ({ ...a }))
    : [{ bank: '', number: '' }],
)

function addRow() {
  accountForms.value.push({ bank: '', number: '' })
}

function removeRow(index) {
  accountForms.value.splice(index, 1)
}

async function pickBank(row) {
  const selected = await modalStore.open(
    BankPickerModal,
    { selected: row.bank },
    { position: 'bottom' },
  )
  if (selected) {
    row.bank = selected
  }
}

const isValid = computed(
  () =>
    accountForms.value.length > 0 &&
    accountForms.value.every((row) => row.bank && /^\d{10,16}$/.test(row.number)),
)

function submit() {
  if (!isValid.value) return
  onboardingStore.setAccounts(accountForms.value.map((row) => ({ ...row })))
  router.push({ name: 'onboarding-job' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <OnboardingProgressBar :current-step="1" />

    <div class="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <div>
        <h1 class="text-head1 text-grey-500">계좌를 연결해 주세요</h1>
        <p class="mt-2 text-body4 text-grey-400">
          입출금 내역을 바탕으로 잡 수입과 소비 흐름을 자동으로 분류해드려요.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="(row, index) in accountForms"
          :key="index"
          class="flex flex-col gap-3 rounded-[20px] border border-grey-50 p-4"
        >
          <p class="text-body1 text-grey-500">계좌 정보</p>

          <div>
            <p class="mb-2 text-body3 text-grey-400">은행</p>
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3.5 text-left text-body4"
              @click="pickBank(row)"
            >
              <span :class="row.bank ? 'text-grey-500' : 'text-grey-300'">{{
                row.bank || '은행을 선택해 주세요'
              }}</span>
              <ChevronDownIcon class="size-4 text-grey-400" />
            </button>
          </div>

          <div>
            <p class="mb-2 text-body3 text-grey-400">계좌번호</p>
            <input
              v-model="row.number"
              type="text"
              inputmode="numeric"
              placeholder="숫자만 입력해 주세요"
              class="w-full rounded-xl bg-grey-30 px-3.5 py-3.5 text-body4 text-grey-500 placeholder:text-grey-300"
            />
          </div>

          <button
            v-if="accountForms.length > 1"
            type="button"
            class="self-end text-caption text-grey-400 underline"
            @click="removeRow(index)"
          >
            삭제
          </button>
        </div>

        <button
          type="button"
          class="rounded-2xl border border-grey-50 py-3.5 text-body4 font-medium text-primary-800"
          @click="addRow"
        >
          + 계좌 추가하기
        </button>

        <p class="text-center text-caption text-grey-400">
          계좌는 나중에 설정에서 추가하거나 변경할 수 있어요.
        </p>
      </div>

      <Button class="mt-auto" :disabled="!isValid" @click="submit">다음</Button>
    </div>
  </div>
</template>
