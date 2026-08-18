<!-- src/features/mypage/MyPageView.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/features/auth/store'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useMypageStore } from './store'
import { fetchProfile, fetchSubscription, fetchPlans } from './api'
import AppHeader from '@/shared/components/AppHeader.vue'
import ProfileHeader from './components/ProfileHeader.vue'
import JobListSection from './components/JobListSection.vue'
import SubscriptionSummaryCard from './components/SubscriptionSummaryCard.vue'
import MenuList from './components/MenuList.vue'
import AccountsManageSection from './components/AccountsManageSection.vue'
import NotificationsManageSection from './components/NotificationsManageSection.vue'
import PermissionsManageSection from './components/PermissionsManageSection.vue'
import SubscriptionStatusSection from './components/SubscriptionStatusSection.vue'
import PaymentMethodsSection from './components/PaymentMethodsSection.vue'
import AppInfoSection from './components/AppInfoSection.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()
const mypageStore = useMypageStore()

const subView = ref(
  route.query.view === 'subscription' || route.query.view === 'notifications'
    ? route.query.view
    : 'main',
)

// route.push({ name: 'mypage', query: { view: ... } })로 같은 라우트에 query만 바뀌어
// 진입하는 경우(예: 마이페이지 화면 자체에서 벨 클릭) 컴포넌트가 리마운트되지 않아
// subView 초기값이 갱신되지 않으므로, query 변화를 별도로 watch한다.
watch(
  () => route.query.view,
  (view) => {
    if (view === 'subscription' || view === 'notifications') subView.value = view
  },
)

const { data: profile } = useQuery({
  queryKey: ['mypage', 'profile'],
  queryFn: fetchProfile,
})

const { data: subscription } = useQuery({
  queryKey: ['mypage', 'subscription'],
  queryFn: fetchSubscription,
})

const { data: plans } = useQuery({
  queryKey: ['mypage', 'plans'],
  queryFn: fetchPlans,
})

watch(subscription, (value) => {
  if (value) mypageStore.setPlan(value.planId)
})

const currentPlanLabel = computed(
  () => plans.value?.find((plan) => plan.id === mypageStore.planId)?.name ?? 'Pro',
)

function goBackToMain() {
  subView.value = 'main'
}

async function handleLogout() {
  await router.push({ name: 'login' })
  onboardingStore.reset()
  mypageStore.reset()
  await authStore.logout()
}

function selectMenuItem(id) {
  if (id === 'logout') {
    handleLogout()
    return
  }
  subView.value = id
}
</script>

<template>
  <template v-if="subView === 'main'">
    <div class="flex flex-col">
      <AppHeader title="마이페이지" hide-bell />

      <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
        <ProfileHeader v-if="profile" :profile="profile" />

        <SubscriptionSummaryCard
          v-if="subscription"
          :subscription="subscription"
          :plan-label="currentPlanLabel"
          @open-status="subView = 'subscription'"
        />

        <JobListSection />

        <MenuList @select="selectMenuItem" />
      </div>
    </div>
  </template>

  <AccountsManageSection
    v-else-if="subView === 'accounts'"
    :profile="profile"
    @back="goBackToMain"
  />
  <NotificationsManageSection
    v-else-if="subView === 'notifications'"
    :profile="profile"
    @back="goBackToMain"
  />
  <PermissionsManageSection
    v-else-if="subView === 'permissions'"
    :profile="profile"
    @back="goBackToMain"
  />
  <SubscriptionStatusSection
    v-else-if="subView === 'subscription' && subscription && plans"
    :subscription="subscription"
    :profile="profile"
    :plans="plans"
    @back="goBackToMain"
    @open-payment-methods="subView = 'paymentMethods'"
  />
  <PaymentMethodsSection
    v-else-if="subView === 'paymentMethods' && subscription && plans"
    :subscription="subscription"
    :plans="plans"
    @back="subView = 'subscription'"
  />
  <AppInfoSection v-else-if="subView === 'appInfo'" @back="goBackToMain" />
</template>
