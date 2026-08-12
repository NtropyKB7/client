<script setup>
import { CATEGORY_COLORS } from '../api'

defineProps({
  categories: { type: Array, required: true },
})
</script>

<template>
  <div>
    <div class="flex h-3.5 w-full overflow-hidden rounded-full">
      <div
        v-for="(category, index) in categories"
        :key="category.id"
        class="h-full"
        :class="CATEGORY_COLORS[index % CATEGORY_COLORS.length]"
        :style="{ width: `${category.percent}%` }"
      />
    </div>
    <div class="mt-3 flex flex-col gap-2.5">
      <div
        v-for="(category, index) in categories"
        :key="category.id"
        class="flex items-center justify-between text-caption"
      >
        <span class="flex items-center gap-2.5 text-[#2e3633]">
          <span
            class="size-2.5 shrink-0 rounded-full"
            :class="CATEGORY_COLORS[index % CATEGORY_COLORS.length]"
          />
          {{ category.label }}
        </span>
        <span class="font-medium text-grey-500">{{ category.percent }}%</span>
      </div>
    </div>
  </div>
</template>
