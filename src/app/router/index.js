import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/store'
import AppLayout from '@/shared/components/AppLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/LoginView.vue'),
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@/features/auth/AuthCallbackView.vue'),
  },
  {
    path: '/onboarding/account',
    name: 'onboarding-account',
    component: () => import('@/features/onboarding/AccountSetupView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding/analyzing',
    name: 'onboarding-analyzing',
    component: () => import('@/features/onboarding/AccountAnalyzingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding/job',
    name: 'onboarding-job',
    component: () => import('@/features/onboarding/JobSetupView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding/goal',
    name: 'onboarding-goal',
    component: () => import('@/features/onboarding/GoalSetupView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true, requiresOnboarding: true },
    children: [
      { path: '', redirect: { name: 'home' } },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/features/home/HomeView.vue'),
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@/features/calendar/CalendarView.vue'),
      },
      {
        path: 'defense-mode',
        name: 'defense-mode',
        component: () => import('@/features/defense-mode/DefenseModeView.vue'),
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/features/report/ReportView.vue'),
      },
      {
        path: 'mypage',
        name: 'mypage',
        component: () => import('@/features/mypage/MyPageView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (
    to.meta.requiresOnboarding &&
    authStore.isAuthenticated &&
    !authStore.user?.onboardingCompleted
  ) {
    return { name: 'onboarding-account' }
  }

  return true
})

export default router
