<!-- src/shared/components/ToastRoot.vue -->
<script setup>
import { useToastStore } from '@/shared/store/toast'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="toastStore.isVisible"
        class="fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4"
      >
        <div class="max-w-sm rounded-lg bg-[#111110] px-4 py-3 text-center text-sm text-white shadow-lg">
          {{ toastStore.message }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
