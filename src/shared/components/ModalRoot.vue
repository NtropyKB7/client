<script setup>
import { useModalStore } from '@/shared/store/modal'
import BaseModal from './BaseModal.vue'

const modalStore = useModalStore()
</script>

<template>
  <BaseModal>
    <component :is="modalStore.component" v-bind="modalStore.props" />
  </BaseModal>
</template>
