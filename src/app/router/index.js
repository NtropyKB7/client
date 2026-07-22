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
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
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
  return true
})

export default router
