<script setup>
import ModalRoot from '@/shared/components/ModalRoot.vue'
import ToastRoot from '@/shared/components/ToastRoot.vue'
</script>

<template>
  <router-view />
  <ModalRoot />
  <ToastRoot />
</template>
