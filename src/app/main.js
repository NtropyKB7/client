import '../style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import { queryClient } from './queryClient'
import { useAuthStore } from '@/features/auth/store'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

const authStore = useAuthStore()
authStore.tryRefresh().finally(() => {
  app.mount('#app')
})
