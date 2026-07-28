<script setup>
defineOptions({ name: 'AppButton' })

defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline' | 'accent'
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
      variant === 'accent'
        ? 'bg-[#FFCC00] text-[#111110]'
        : variant === 'outline'
          ? 'border border-[#111110]/20 bg-white text-[#111110]'
          : 'bg-[#111110] text-white'
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
