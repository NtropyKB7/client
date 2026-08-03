<!-- src/features/mypage/components/ProfileHeader.vue -->
<script setup>
defineProps({
  profile: { type: Object, required: true },
})
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-grey-500 text-caption font-bold text-white"
    >
      {{ profile.avatarLabel }}
    </div>
    <div>
      <p class="text-[17px] font-bold text-grey-500">{{ profile.name }}님</p>
      <p class="text-caption text-grey-300">{{ profile.email }}</p>
    </div>
  </div>
</template>
