<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import CloseIcon from './icons/CloseIcon.vue'

const modalStore = useModalStore()

function handleKeydown(event) {
  if (event.key === 'Escape') {
    modalStore.close()
  }
}

watch(
  () => modalStore.isOpen,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="#app-frame">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modalStore.isOpen"
        class="fixed inset-0 z-50 flex"
        :class="
          modalStore.position === 'full'
            ? ''
            : modalStore.position === 'bottom'
              ? 'items-end justify-center bg-black/40'
              : 'items-center justify-center bg-black/40'
        "
        @click.self="modalStore.position === 'full' ? undefined : modalStore.close()"
      >
        <Transition
          appear
          :enter-active-class="
            modalStore.position === 'full'
              ? 'transition duration-150 ease-out'
              : modalStore.position === 'bottom'
                ? 'transition duration-200 ease-out'
                : 'transition duration-150 ease-out'
          "
          :enter-from-class="
            modalStore.position === 'full'
              ? 'translate-x-full'
              : modalStore.position === 'bottom'
                ? 'translate-y-full'
                : 'scale-95 opacity-0'
          "
          :leave-active-class="
            modalStore.position === 'full'
              ? 'transition duration-150 ease-in'
              : modalStore.position === 'bottom'
                ? 'transition duration-150 ease-in'
                : 'transition duration-100 ease-in'
          "
          :leave-to-class="
            modalStore.position === 'full'
              ? 'translate-x-full'
              : modalStore.position === 'bottom'
                ? 'translate-y-full'
                : 'scale-95 opacity-0'
          "
        >
          <div
            v-if="modalStore.isOpen"
            class="relative bg-white"
            :class="
              modalStore.position === 'full'
                ? 'h-full w-full overflow-y-auto'
                : modalStore.position === 'bottom'
                  ? 'max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-t-2xl p-6 pb-8'
                  : 'mx-4 max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-[#111110]/20 p-6'
            "
          >
            <div
              v-if="modalStore.position === 'bottom'"
              class="mx-auto mb-4 h-1 w-9 rounded-full bg-[#111110]/15"
            />
            <button
              v-if="modalStore.position !== 'full'"
              type="button"
              class="absolute right-4 top-4 text-[#6B6A65]"
              aria-label="닫기"
              @click="modalStore.close()"
            >
              <CloseIcon class="h-5 w-5" />
            </button>

            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
