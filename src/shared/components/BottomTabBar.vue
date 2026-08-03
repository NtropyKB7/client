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
    class="fixed inset-x-0 bottom-0 flex h-[84px] border-t border-grey-50 bg-grey-white pt-1.5"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.label"
      :to="tab.to"
      class="flex flex-1 flex-col items-center justify-center gap-1.5 whitespace-nowrap text-body3 text-grey-300"
      active-class="text-primary-600!"
    >
      <component :is="tab.icon" class="size-6" />
      {{ tab.label }}
    </router-link>
  </nav>
</template>
