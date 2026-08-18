<!-- src/features/mypage/components/AppInfoSection.vue -->
<script setup>
import AppHeader from '@/shared/components/AppHeader.vue'
import { termsMeta, termsSections } from '../termsContent'

defineEmits(['back'])
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <h2 class="text-body1 text-grey-500">앱 정보 및 이용약관</h2>
      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4 text-caption text-grey-300">
        <p>앱 버전 1.0.0</p>
      </div>

      <div
        class="rounded-2xl border border-primary-100 bg-primary-50 p-4 text-caption text-primary-800"
      >
        본 약관은 베타 서비스 운영을 위한 잠정 약관이며, 정식 서비스 출시 전 법률 검토를 거쳐 개정될
        수 있습니다.
      </div>

      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4 text-caption text-grey-400">
        <p>상호: {{ termsMeta.companyName }}</p>
        <p>대표자: {{ termsMeta.representativeName }}</p>
        <p>사업자등록번호: {{ termsMeta.businessRegistrationNumber }}</p>
        <p>통신판매업신고번호: {{ termsMeta.mailOrderBusinessNumber }}</p>
        <p>주소: {{ termsMeta.address }}</p>
        <p>고객센터 이메일: {{ termsMeta.email }}</p>
        <p>시행일: {{ termsMeta.effectiveDate }}</p>
      </div>

      <div class="flex flex-col gap-5">
        <section
          v-for="section in termsSections"
          :key="section.heading"
          class="flex flex-col gap-3"
        >
          <h3 class="text-body1 text-grey-500">{{ section.heading }}</h3>

          <div v-for="article in section.articles" :key="article.title" class="flex flex-col gap-1">
            <p class="text-body3 text-grey-500">{{ article.title }}</p>
            <p
              v-for="(line, index) in article.body"
              :key="index"
              class="whitespace-pre-wrap text-body4 text-grey-400"
            >
              {{ line }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
