<script setup>
defineOptions({ name: 'AppButton' })

defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'outline' | 'accent' | 'danger'
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full rounded-full py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
    :class="
      variant === 'accent'
        ? 'bg-[#FEE500] text-[#1A1A1A]'
        : variant === 'outline'
          ? 'border border-[#D4D4D4] bg-white text-[#1A1A1A]'
          : variant === 'danger'
            ? 'bg-rose-600 text-white'
            : 'bg-primary-500 text-white'
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
