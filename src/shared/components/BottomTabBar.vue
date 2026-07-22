<script setup>
import HomeIcon from './icons/HomeIcon.vue'
import CalendarIcon from './icons/CalendarIcon.vue'
import DefenseIcon from './icons/DefenseIcon.vue'
import ReportIcon from './icons/ReportIcon.vue'
import MyPageIcon from './icons/MyPageIcon.vue'

const tabs = [
  { to: { name: 'home' }, label: '홈', icon: HomeIcon },
  { to: { name: 'calendar' }, label: '캘린더', icon: CalendarIcon },
  { to: { name: 'defense-mode' }, label: '방어모드', icon: DefenseIcon },
  { to: { name: 'report' }, label: '리포트', icon: ReportIcon },
  { to: { name: 'mypage' }, label: '마이페이지', icon: MyPageIcon },
]
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 flex h-[74px] border-t border-[#111110]/20 bg-[#F4F3EF]"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.label"
      :to="tab.to"
      class="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-[#6B6A65]"
      active-class="text-[#000000]"
    >
      <component :is="tab.icon" class="h-6 w-6" />
      {{ tab.label }}
    </router-link>
  </nav>
</template>
