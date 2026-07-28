<script setup>
defineOptions({ name: 'AppContainer' })

defineProps({
  clickable: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    class="flex w-full items-center gap-3 border-b border-[#111110]/5 py-3 text-left last:border-b-0"
    @click="clickable ? $emit('click', $event) : undefined"
  >
    <div v-if="$slots.leading" class="shrink-0">
      <slot name="leading" />
    </div>
    <div class="min-w-0 flex-1">
      <slot />
    </div>
    <div v-if="$slots.trailing" class="shrink-0">
      <slot name="trailing" />
    </div>
  </component>
</template>
