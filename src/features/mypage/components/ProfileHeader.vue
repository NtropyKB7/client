<!-- src/features/mypage/components/ProfileHeader.vue -->
<script setup>
defineProps({
  profile: { type: Object, required: true },
})
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111110] text-sm font-semibold text-white"
    >
      {{ profile.avatarLabel }}
    </div>
    <div>
      <p class="text-sm font-semibold text-[#111110]">{{ profile.name }}님</p>
      <p class="text-xs text-[#6B6A65]">{{ profile.email }}</p>
    </div>
  </div>
</template>
