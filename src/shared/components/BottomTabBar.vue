<script setup>
const tabs = [
  { to: { name: 'home' }, label: '홈' },
  { to: { name: 'calendar' }, label: '캘린더' },
  { to: { name: 'defense-mode' }, label: '방어모드' },
  { to: { name: 'report' }, label: '리포트' },
  { to: { name: 'mypage' }, label: '마이페이지' },
]
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 flex border-t border-gray-200 bg-white"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.label"
      :to="tab.to"
      class="flex flex-1 flex-col items-center py-2 text-xs text-gray-500"
      active-class="font-semibold text-black"
    >
      {{ tab.label }}
    </router-link>
  </nav>
</template>
