<script setup>
import { ref } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  name: { type: String, required: true },
  cyclePattern: { type: String, required: true },
  settlementCycle: { type: String, required: true },
})

const emit = defineEmits(['save'])

const isEditing = ref(false)
const draft = ref({
  name: props.name,
  cyclePattern: props.cyclePattern,
  settlementCycle: props.settlementCycle,
})

function startEdit() {
  draft.value = {
    name: props.name,
    cyclePattern: props.cyclePattern,
    settlementCycle: props.settlementCycle,
  }
  isEditing.value = true
}

function save() {
  emit('save', { ...draft.value })
  isEditing.value = false
}
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <template v-if="!isEditing">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold text-[#111110]">{{ name }}</p>
        <button type="button" class="text-xs text-[#6B6A65] underline" @click="startEdit">
          수정
        </button>
      </div>
      <p class="mt-1 text-xs text-[#6B6A65]">{{ cyclePattern }}</p>
      <p class="text-xs text-[#6B6A65]">{{ settlementCycle }}</p>
    </template>
    <template v-else>
      <label class="block text-xs text-[#6B6A65]">
        잡 이름
        <input
          v-model="draft.name"
          type="text"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
      <label class="mt-2 block text-xs text-[#6B6A65]">
        근무 주기 패턴
        <input
          v-model="draft.cyclePattern"
          type="text"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
      <label class="mt-2 block text-xs text-[#6B6A65]">
        정산 주기
        <input
          v-model="draft.settlementCycle"
          type="text"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
      <div class="mt-3">
        <Button @click="save">저장</Button>
      </div>
    </template>
  </div>
</template>
