import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SEED_ENTRIES_2026_07 } from './api'

const STORAGE_KEY = 'ntropy_calendar'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useCalendarStore = defineStore('calendar', () => {
  const persisted = loadPersisted()
  const entries = ref(persisted?.entries ?? SEED_ENTRIES_2026_07.map((entry) => ({ ...entry })))

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: entries.value }))
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 유지
    }
  }

  function entriesForDate(dateKey) {
    return entries.value.filter((entry) => entry.date === dateKey)
  }

  function addEntry(entry) {
    entries.value.push(entry)
    persist()
  }

  function updateEntry(id, patch) {
    const target = entries.value.find((entry) => entry.id === id)
    if (target) {
      Object.assign(target, patch)
      persist()
    }
  }

  function deleteEntry(id) {
    const index = entries.value.findIndex((entry) => entry.id === id)
    if (index !== -1) {
      entries.value.splice(index, 1)
      persist()
    }
  }

  return { entries, entriesForDate, addEntry, updateEntry, deleteEntry }
})
