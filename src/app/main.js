import '../style.css'
import '@/shared/store/installPrompt'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { queryClient } from './queryClient'
import { useAuthStore } from '@/features/auth/store'

const app = createApp(App)

app.use(createPinia())

// router는 install 시점에 곧바로 현재 URL에 대한 첫 내비게이션(및 beforeEach 가드)을 비동기로
// 시작한다 — app.mount()가 아니라 app.use(router)가 트리거다. tryRefresh가 끝나기 전에
// app.use(router)부터 호출하면, 가드의 첫 실행이 accessToken이 아직 없는 상태를 보고 무조건
// /login으로 보내버려 새로고침할 때마다 로그인 화면이 뜨는 문제가 생긴다. 그래서 router를
// tryRefresh가 끝난 뒤에 설치해, 가드의 첫 평가가 항상 최신 인증 상태를 보게 한다.
const authStore = useAuthStore()
authStore.tryRefresh().finally(() => {
  app.use(router)
  app.use(VueQueryPlugin, { queryClient })
  app.mount('#app')
})
