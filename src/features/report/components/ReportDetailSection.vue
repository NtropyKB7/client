<!-- src/features/report/components/ReportDetailSection.vue -->
<script setup>
import { computed } from 'vue'
import { CATEGORY_COLORS } from '../api'
import { formatMan } from '../utils'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon.vue'
import Button from '@/shared/components/Button.vue'
import CategoryBar from './CategoryBar.vue'
import RecommendedProductCard from './RecommendedProductCard.vue'

const props = defineProps({
  monthLabel: { type: String, required: true },
  isSubscribed: { type: Boolean, required: true },
  detail: { type: Object, required: true },
})

const emit = defineEmits(['back', 'subscribe'])

const spendChangeClass = computed(() =>
  props.detail.spendChangePercent <= 0 ? 'text-emerald-600' : 'text-rose-600',
)

function shareKakao() {
  console.log('kakao-report requested') // TEMP: 백엔드 카카오톡 리포트 발송 연동 전 콘솔 확인용
}

function shareEmail() {
  console.log('email-report requested') // TEMP: 백엔드 메일 리포트 발송 연동 전 콘솔 확인용
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      type="button"
      class="flex items-center gap-1 text-xs text-[#6B6A65]"
      @click="emit('back')"
    >
      <ChevronLeftIcon class="h-4 w-4" />
      리포트
    </button>

    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-[#111110]">{{ monthLabel }} 리포트</h1>
        <span
          v-if="isSubscribed"
          class="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700"
        >
          구독중
        </span>
      </div>
      <p class="mt-1 text-sm text-[#6B6A65]">소비 분석·금융상품 추천이 담긴 월간 보고서예요.</p>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <div class="rounded-xl border border-[#111110]/10 bg-white p-3">
        <p class="text-xs text-[#6B6A65]">총소득</p>
        <p class="mt-1 text-base font-semibold text-[#111110]">
          {{ formatMan(detail.totalIncome, false) }}
        </p>
      </div>
      <div class="rounded-xl border border-[#111110]/10 bg-white p-3">
        <p class="text-xs text-[#6B6A65]">총소비</p>
        <p class="mt-1 text-base font-semibold text-[#111110]">
          {{ formatMan(detail.totalSpend, false) }}
        </p>
      </div>
      <div class="rounded-xl border border-[#111110]/10 bg-white p-3">
        <p class="text-xs text-[#6B6A65]">가용자금</p>
        <p class="mt-1 text-base font-semibold text-emerald-600">
          {{ formatMan(detail.availableFunds, false) }}
        </p>
      </div>
    </div>

    <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold text-[#111110]">주요 소비 카테고리</p>
        <p class="text-xs font-semibold" :class="spendChangeClass">
          전월대비 {{ detail.spendChangePercent }}%
        </p>
      </div>
      <div class="mt-3 flex flex-col gap-3">
        <CategoryBar
          v-for="(category, index) in detail.categories"
          :key="category.id"
          :label="category.label"
          :percent="category.percent"
          :color-class="CATEGORY_COLORS[index % CATEGORY_COLORS.length]"
        />
      </div>
    </div>

    <RecommendedProductCard
      :name="detail.recommendedProduct.name"
      :description="detail.recommendedProduct.description"
      :available-funds="detail.availableFunds"
      :is-subscribed="isSubscribed"
      @subscribe="emit('subscribe')"
    />

    <div v-if="isSubscribed" class="flex flex-col gap-2">
      <Button variant="outline" @click="shareKakao">카카오톡으로 리포트 받기</Button>
      <Button variant="outline" @click="shareEmail">메일로 리포트 받기</Button>
    </div>
  </div>
</template>
