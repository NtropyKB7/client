<script setup>
import ModalRoot from '@/shared/components/ModalRoot.vue'
import ToastRoot from '@/shared/components/ToastRoot.vue'
</script>

<template>
  <div class="flex min-h-screen justify-center bg-grey-100">
    <div
      id="app-frame"
      class="relative min-h-screen w-full max-w-[430px] overflow-hidden bg-grey-white contain-layout sm:shadow-2xl"
    >
      <router-view />
      <ModalRoot />
      <ToastRoot />
    </div>
  </div>
</template>
