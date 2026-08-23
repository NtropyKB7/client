<script setup>
import { getBankStyle, isAccountActive } from '../api'
import ToggleSwitch from '@/shared/components/ToggleSwitch.vue'

defineProps({
  account: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
})

defineEmits(['toggle'])
</script>

<template>
  <div class="flex items-center justify-between rounded-[20px] border border-grey-50 p-4">
    <div class="flex items-center gap-3">
      <span
        class="flex size-9 shrink-0 items-center justify-center rounded-xl text-body3 font-bold"
        :style="{
          backgroundColor: getBankStyle(account.bankName).bg,
          color: getBankStyle(account.bankName).text,
        }"
      >
        {{ getBankStyle(account.bankName).initial }}
      </span>
      <div>
        <p class="text-body4 font-medium text-grey-500">{{ account.bankName }}</p>
        <p class="text-caption text-grey-400">{{ account.accountNoMasked }}</p>
      </div>
    </div>

    <ToggleSwitch
      :checked="isAccountActive(account)"
      :disabled="disabled"
      @change="$emit('toggle')"
    />
  </div>
</template>
