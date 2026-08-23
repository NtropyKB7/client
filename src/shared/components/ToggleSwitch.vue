<script setup>
defineOptions({ name: 'ToggleSwitch' })

defineProps({
  checked: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['change'])
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-40"
    :class="checked ? 'bg-primary-500' : 'bg-grey-200'"
    @click="$emit('change')"
  >
    <span
      class="inline-block size-5 transform rounded-full bg-grey-white shadow transition-transform"
      :class="checked ? 'translate-x-5' : 'translate-x-0.5'"
    />
  </button>
</template>
