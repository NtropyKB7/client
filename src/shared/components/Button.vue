<script setup>
defineOptions({ name: 'AppButton' })

defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline'
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
    :class="
      variant === 'outline'
        ? 'border border-[#111110]/20 bg-white text-[#111110]'
        : 'bg-[#FFCC00] text-[#111110]'
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
