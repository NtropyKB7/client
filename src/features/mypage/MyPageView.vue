<!-- src/features/mypage/MyPageView.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useAuthStore } from '@/features/auth/store'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useMypageStore } from './store'
import { fetchProfile, fetchSubscription, PLAN_OPTIONS } from './api'
import ProfileHeader from './components/ProfileHeader.vue'
import JobListSection from './components/JobListSection.vue'
import SubscriptionSummaryCard from './components/SubscriptionSummaryCard.vue'
import MenuList from './components/MenuList.vue'
import AccountsManageSection from './components/AccountsManageSection.vue'
import NotificationsManageSection from './components/NotificationsManageSection.vue'
import PermissionsManageSection from './components/PermissionsManageSection.vue'
import SubscriptionStatusSection from './components/SubscriptionStatusSection.vue'
import SubscriptionPlanModal from './components/SubscriptionPlanModal.vue'
import AppInfoSection from './components/AppInfoSection.vue'

const router = useRouter()
const modalStore = useModalStore()
const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()
const mypageStore = useMypageStore()

const subView = ref('main')

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

const currentPlanLabel = computed(
  () => PLAN_OPTIONS.find((plan) => plan.id === mypageStore.planId)?.name ?? 'Pro',
)

function goBackToMain() {
  subView.value = 'main'
}

function openPlanModal() {
  modalStore.open(SubscriptionPlanModal, { subscription: subscription.value }, { position: 'full' })
}

async function handleLogout() {
  await router.push({ name: 'login' })
  onboardingStore.reset()
  mypageStore.reset()
  authStore.logout()
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-6">
    <ProfileHeader v-if="subView !== 'subscription' && profile" :profile="profile" />

    <template v-if="subView === 'main'">
      <SubscriptionSummaryCard
        v-if="subscription"
        :subscription="subscription"
        :plan-label="currentPlanLabel"
        @open-status="subView = 'subscription'"
      />

      <JobListSection />

      <MenuList @select="(id) => (subView = id)" />

      <button
        type="button"
        class="mt-2 text-left text-sm font-medium text-rose-600"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </template>

    <AccountsManageSection v-else-if="subView === 'accounts'" @back="goBackToMain" />
    <NotificationsManageSection v-else-if="subView === 'notifications'" @back="goBackToMain" />
    <PermissionsManageSection v-else-if="subView === 'permissions'" @back="goBackToMain" />
    <SubscriptionStatusSection
      v-else-if="subView === 'subscription' && subscription"
      :subscription="subscription"
      @back="goBackToMain"
      @open-plan-modal="openPlanModal"
    />
    <AppInfoSection v-else-if="subView === 'appInfo'" @back="goBackToMain" />
  </div>
</template>
