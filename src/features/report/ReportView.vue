<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { fetchProfile, fetchSubscription } from '@/features/mypage/api'
import { useMypageStore } from '@/features/mypage/store'
import { fetchReportList, fetchReportDetail } from './api'
import AppHeader from '@/shared/components/AppHeader.vue'
import ReportListSection from './components/ReportListSection.vue'
import ReportDetailSection from './components/ReportDetailSection.vue'

const router = useRouter()
const mypageStore = useMypageStore()

const subView = ref('list')
const selectedMonth = ref(null)

const { data: profile } = useQuery({
  queryKey: ['mypage', 'profile'],
  queryFn: fetchProfile,
})

const { data: subscription } = useQuery({
  queryKey: ['mypage', 'subscription'],
  queryFn: fetchSubscription,
})

watch(subscription, (value) => {
  if (value) mypageStore.initPlan(value.planId)
})

const isSubscribed = computed(() => mypageStore.planId === 'pro')

const { data: reportList } = useQuery({
  queryKey: ['report', 'list'],
  queryFn: fetchReportList,
})

const { data: reportDetail } = useQuery({
  queryKey: computed(() => ['report', 'detail', selectedMonth.value]),
  queryFn: () => fetchReportDetail(selectedMonth.value),
  enabled: computed(() => subView.value === 'detail' && !!selectedMonth.value),
})

const selectedMonthLabel = computed(
  () => reportList.value?.find((report) => report.month === selectedMonth.value)?.monthLabel ?? '',
)

function openDetail(month) {
  selectedMonth.value = month
  subView.value = 'detail'
}

function backToList() {
  subView.value = 'list'
}

function goToSubscription() {
  router.push({ name: 'mypage', query: { view: 'subscription' } })
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader v-if="subView === 'list'" title="리포트" />
    <AppHeader v-else title="리포트" back @back="backToList" />

    <div class="px-4 py-6">
      <p v-if="subView === 'list' && !reportList" class="text-caption text-grey-300">
        불러오는 중...
      </p>
      <p v-else-if="subView === 'detail' && !reportDetail" class="text-caption text-grey-300">
        불러오는 중...
      </p>

      <ReportListSection
        v-else-if="subView === 'list'"
        :greeting-name="profile?.name ?? ''"
        :reports="reportList"
        @select="openDetail"
      />

      <ReportDetailSection
        v-else-if="subView === 'detail'"
        :month-label="selectedMonthLabel"
        :is-subscribed="isSubscribed"
        :detail="reportDetail"
        :report-list="reportList"
        @change-month="openDetail"
        @subscribe="goToSubscription"
      />
    </div>
  </div>
</template>
