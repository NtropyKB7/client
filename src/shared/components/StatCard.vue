<script setup>
import { ref } from 'vue'
import ChevronDownIcon from './icons/ChevronDownIcon.vue'

defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  badgeLabel: { type: String, default: '' },
  badgeClass: { type: String, default: '' },
  progressPercent: { type: Number, default: null },
})

const isExpanded = ref(false)

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <button
      type="button"
      class="flex w-full items-center justify-between text-left"
      @click="toggle"
    >
      <div class="flex-1">
        <p class="text-xs text-[#6B6A65]">{{ title }}</p>
        <p class="mt-1 text-base font-semibold text-[#111110]">{{ value }}</p>
        <div
          v-if="progressPercent !== null"
          class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F1EC]"
        >
          <div
            class="h-full rounded-full bg-[#FFCC00]"
            :style="{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }"
          />
        </div>
      </div>
      <span
        v-if="badgeLabel"
        class="ml-2 shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold"
        :class="badgeClass"
      >
        {{ badgeLabel }}
      </span>
      <ChevronDownIcon
        class="ml-2 h-4 w-4 shrink-0 text-[#6B6A65] transition-transform"
        :class="{ 'rotate-180': isExpanded }"
      />
    </button>
    <div v-if="isExpanded" class="mt-3 border-t border-[#111110]/10 pt-3 text-xs text-[#6B6A65]">
      <slot name="detail" />
    </div>
  </div>
</template>
