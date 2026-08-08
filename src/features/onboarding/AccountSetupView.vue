<script setup>
import { useRouter } from 'vue-router'
import { useOnboardingStore } from './store'
import { useAccountConnections } from './composables/useAccountConnections'
import { getBankStyle, isAccountActive, BIRTH_DATE_DEFAULT_YEAR } from './api'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'
import DatePicker from '@/shared/components/DatePicker.vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const {
  connectedAccounts,
  pendingRows,
  validPendingRows,
  canProceed,
  togglingAccountId,
  addRow,
  removeRow,
  pickBank,
  canDeactivate,
  toggleAccount,
} = useAccountConnections()

function submit() {
  if (!canProceed.value) return
  onboardingStore.setPendingAccountRows(validPendingRows.value.map((row) => ({ ...row })))
  router.push({ name: 'onboarding-analyzing' })
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

      <div v-if="connectedAccounts?.length" class="flex flex-col gap-3">
        <p class="text-body1 text-grey-500">연결된 계좌</p>

        <div
          v-for="account in connectedAccounts"
          :key="account.accountId"
          class="flex items-center justify-between rounded-[20px] border border-grey-50 p-4"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-xl text-body3 font-bold"
              :style="{
                backgroundColor: getBankStyle(account.bankName).bg,
                color: getBankStyle(account.bankName).text,
              }"
            >
              {{ getBankStyle(account.bankName).initial }}
            </span>
            <div>
              <p class="text-body4 font-medium text-grey-500">{{ account.bankName }}</p>
              <p class="text-caption text-grey-400">{{ account.accountNoMasked }}</p>
            </div>
          </div>

          <button
            type="button"
            class="rounded-full px-3 py-1.5 text-caption font-bold transition-opacity disabled:opacity-40"
            :class="
              isAccountActive(account)
                ? 'bg-primary-50 text-primary-800'
                : 'bg-grey-30 text-grey-400'
            "
            :disabled="togglingAccountId === account.accountId || !canDeactivate(account)"
            @click="toggleAccount(account)"
          >
            {{ isAccountActive(account) ? '연결됨' : '연결 끊김' }}
          </button>
        </div>

        <p
          v-if="connectedAccounts.some((account) => !canDeactivate(account))"
          class="text-caption text-grey-400"
        >
          최소 1개 계좌는 연결되어 있어야 해요.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-body1 text-grey-500">새 은행 연결</p>

        <div
          v-for="(row, index) in pendingRows"
          :key="index"
          class="flex flex-col gap-3 rounded-[20px] border border-grey-50 p-4"
        >
          <div class="flex items-center justify-between">
            <p class="text-body1 text-grey-500">은행 로그인 정보</p>
            <button
              v-if="pendingRows.length > 1"
              type="button"
              class="text-caption text-grey-400 underline"
              @click="removeRow(index)"
            >
              삭제
            </button>
          </div>

          <div>
            <p class="mb-2 text-body3 text-grey-400">은행</p>
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3.5 text-left"
              @click="pickBank(row)"
            >
              <span class="text-body4" :class="row.bank ? 'text-grey-500' : 'text-grey-300'">
                {{ row.bank?.bankName || '은행을 선택해 주세요' }}
              </span>
              <ChevronDownIcon class="size-4 text-grey-400" />
            </button>
          </div>

          <div>
            <p class="mb-2 text-body3 text-grey-400">은행 로그인 아이디</p>
            <input
              v-model="row.bankLoginId"
              type="text"
              placeholder="은행 로그인 아이디를 입력해 주세요"
              class="w-full rounded-xl bg-grey-30 px-3.5 py-3.5 text-body4 text-grey-500 placeholder:text-grey-300"
            />
          </div>

          <div>
            <p class="mb-2 text-body3 text-grey-400">은행 로그인 비밀번호</p>
            <input
              v-model="row.bankLoginPassword"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              class="w-full rounded-xl bg-grey-30 px-3.5 py-3.5 text-body4 text-grey-500 placeholder:text-grey-300"
            />
          </div>

          <div v-if="row.bank?.birthDateRequired">
            <p class="mb-2 text-body3 text-grey-400">생년월일</p>
            <DatePicker
              v-model="row.birthDate"
              placeholder="생년월일을 선택해 주세요"
              :initial-year="BIRTH_DATE_DEFAULT_YEAR"
            />
          </div>
        </div>

        <button
          type="button"
          class="rounded-2xl border border-grey-50 py-3.5 text-body4 font-medium text-primary-800"
          @click="addRow"
        >
          + 은행 추가하기
        </button>

        <p class="text-center text-caption text-grey-400">
          추가 계좌는 나중에 설정에서 연결할 수 있어요.
        </p>
      </div>

      <Button class="mt-auto" :disabled="!canProceed" @click="submit">다음</Button>
    </div>
  </div>
</template>
