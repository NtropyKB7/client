<!-- src/features/mypage/components/AccountsManageSection.vue -->
<script setup>
import { ref } from 'vue'
import { useAccountConnections } from '@/features/onboarding/composables/useAccountConnections'
import {
  registerAccountRows,
  getBankStyle,
  isAccountActive,
  BIRTH_DATE_DEFAULT_YEAR,
} from '@/features/onboarding/api'
import AppHeader from '@/shared/components/AppHeader.vue'
import ProfileHeader from './ProfileHeader.vue'
import Button from '@/shared/components/Button.vue'
import DatePicker from '@/shared/components/DatePicker.vue'

defineProps({
  profile: { type: Object, default: null },
})

defineEmits(['back'])

const {
  connectedAccounts,
  pendingRows,
  validPendingRows,
  togglingAccountId,
  addRow,
  removeRow,
  pickBank,
  canDeactivate,
  toggleAccount,
  removePendingRow,
} = useAccountConnections()

const isSaving = ref(false)

async function save() {
  if (validPendingRows.value.length === 0) return
  isSaving.value = true
  try {
    await registerAccountRows([...validPendingRows.value], {
      onRowRegistered: (row) => removePendingRow(row),
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pb-6 pt-5">
      <ProfileHeader v-if="profile" :profile="profile" />

      <div v-if="connectedAccounts?.length" class="flex flex-col gap-3">
        <p class="text-body1 text-grey-500">연동된 계좌</p>

        <div
          v-for="account in connectedAccounts"
          :key="account.accountId"
          class="flex items-center justify-between rounded-[20px] border border-grey-50 bg-grey-white p-4"
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

      <div
        v-for="(row, index) in pendingRows"
        :key="index"
        class="flex flex-col gap-4 rounded-[20px] border border-grey-50 bg-grey-white p-4"
      >
        <div class="flex items-center justify-between">
          <p class="text-body1 text-grey-500">새 은행 로그인 정보</p>
          <button
            v-if="pendingRows.length > 1"
            type="button"
            class="text-caption text-grey-300"
            @click="removeRow(index)"
          >
            삭제
          </button>
        </div>

        <div>
          <p class="text-caption font-medium text-grey-400">은행</p>
          <button
            type="button"
            class="mt-1.5 flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3 text-left"
            @click="pickBank(row)"
          >
            <span class="text-body4" :class="row.bank ? 'text-grey-500' : 'text-grey-300'">
              {{ row.bank?.bankName || '은행 선택' }}
            </span>
          </button>
        </div>

        <div>
          <p class="text-caption font-medium text-grey-400">은행 로그인 아이디</p>
          <input
            v-model="row.bankLoginId"
            type="text"
            placeholder="은행 로그인 아이디를 입력해 주세요"
            class="mt-1.5 w-full rounded-xl bg-grey-30 px-3.5 py-3 text-body4 text-grey-500 placeholder:text-grey-300"
          />
        </div>

        <div>
          <p class="text-caption font-medium text-grey-400">은행 로그인 비밀번호</p>
          <input
            v-model="row.bankLoginPassword"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            class="mt-1.5 w-full rounded-xl bg-grey-30 px-3.5 py-3 text-body4 text-grey-500 placeholder:text-grey-300"
          />
        </div>

        <div v-if="row.bank?.birthDateRequired">
          <p class="text-caption font-medium text-grey-400">생년월일</p>
          <div class="mt-1.5">
            <DatePicker
              v-model="row.birthDate"
              placeholder="생년월일을 선택해 주세요"
              :initial-year="BIRTH_DATE_DEFAULT_YEAR"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        class="rounded-xl bg-primary-500 py-3 text-body4 font-bold text-white"
        @click="addRow"
      >
        + 계좌 추가하기
      </button>

      <Button class="mt-2" :disabled="validPendingRows.length === 0 || isSaving" @click="save">
        {{ isSaving ? '연결하는 중...' : '저장' }}
      </Button>
    </div>
  </div>
</template>
