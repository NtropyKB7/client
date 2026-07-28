<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import TestModal from './TestModal.vue'
import JobCard from '@/shared/components/JobCard.vue'
import Button from '@/shared/components/Button.vue'
import StatCard from '@/shared/components/StatCard.vue'
import Container from '@/shared/components/Container.vue'

const modalStore = useModalStore()

function openTestModal() {
  modalStore.open(TestModal)
}

function openBottomSheetTest() {
  modalStore.open(TestModal, {}, { position: 'bottom' })
}

const demoJob = ref({
  name: '대리운전',
  cyclePattern: '평일 저녁 6시~11시',
  settlementCycle: '익일 정산',
})

function updateDemoJob(updated) {
  demoJob.value = updated
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <h1 class="text-xl font-bold">마이페이지</h1>

    <!-- TEMP: 공용 컴포넌트 동작 확인용 임시 데모 영역.
         온보딩/홈 화면이 실제 소비처가 되면(다음 계획) 이 블록 전체를 삭제할 것. -->
    <div class="flex flex-col gap-4 rounded-xl border border-dashed border-[#111110]/20 p-4">
      <p class="text-xs font-semibold text-[#6B6A65]">컴포넌트 데모 (임시)</p>

      <div class="flex gap-2">
        <Button @click="openTestModal">중앙 모달 테스트</Button>
        <Button variant="outline" @click="openBottomSheetTest">바텀시트 테스트</Button>
      </div>

      <JobCard
        :name="demoJob.name"
        :cycle-pattern="demoJob.cyclePattern"
        :settlement-cycle="demoJob.settlementCycle"
        @save="updateDemoJob"
      />

      <StatCard
        title="목표 달성율"
        value="78% (195만원)"
        :progress-percent="78"
        badge-label="주의"
        badge-class="bg-amber-100 text-amber-700"
      >
        <template #detail>목표 250만원 중 195만원 달성</template>
      </StatCard>

      <div class="rounded-xl border border-[#111110]/10 bg-white px-4">
        <Container clickable>
          <p class="text-sm text-[#111110]">연동 계좌 관리</p>
          <template #trailing>
            <span class="text-xs text-[#6B6A65]">&gt;</span>
          </template>
        </Container>
        <Container clickable>
          <p class="text-sm text-[#111110]">알림 이력 관리</p>
          <template #trailing>
            <span class="text-xs text-[#6B6A65]">&gt;</span>
          </template>
        </Container>
      </div>
    </div>
  </div>
</template>
