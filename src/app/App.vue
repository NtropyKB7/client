<script setup>
import ModalRoot from '@/shared/components/ModalRoot.vue'
import ToastRoot from '@/shared/components/ToastRoot.vue'
</script>

<template>
  <div class="flex h-dvh justify-center bg-grey-100">
    <div
      id="app-frame"
      class="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-grey-white contain-layout sm:shadow-2xl"
    >
      <div class="scrollbar-none flex-1 overflow-y-auto overscroll-contain">
        <router-view />
      </div>
      <ModalRoot />
      <ToastRoot />
    </div>
  </div>
</template>
