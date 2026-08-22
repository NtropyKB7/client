<script setup>
import { ref } from 'vue'
import ModalRoot from '@/shared/components/ModalRoot.vue'
import ToastRoot from '@/shared/components/ToastRoot.vue'
import { useDragScroll } from '@/shared/composables/useDragScroll'

const scrollRef = ref(null)
useDragScroll(scrollRef, { axis: 'y' })
</script>

<template>
  <div class="flex h-dvh justify-center bg-grey-100">
    <div
      id="app-frame"
      class="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-grey-white contain-layout sm:shadow-2xl"
    >
      <div ref="scrollRef" class="scrollbar-none flex-1 overflow-y-auto overscroll-contain">
        <router-view />
      </div>
      <ModalRoot />
      <ToastRoot />
    </div>
  </div>
</template>
