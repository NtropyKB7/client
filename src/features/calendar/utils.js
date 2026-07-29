/**
 * 캘린더 그리드/집계 계산을 담당하는 순수 함수 모음.
 * store/컴포넌트에서 공통으로 사용.
 */

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 1일 앞의 빈 칸(null)을 채운 월간 그리드를 반환한다. month는 1~12.
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month - 1, day))
  }
  return cells
}

export function computeDayStatus(dayEntries, isDefenseMode) {
  if (isDefenseMode) return 'defense'
  if (dayEntries.length === 0) return 'none'
  const allSettled = dayEntries.every((entry) => entry.status === 'settled')
  return allSettled ? 'settled' : 'pending'
}

export function getUniqueCategories(dayEntries) {
  return [...new Set(dayEntries.map((entry) => entry.category))]
}

/**
 * 자정을 넘기는 근무(예: 23:30~02:00)를 보정해 시간을 계산한다.
 */
export function computeEntryHours(entry) {
  const [startHour, startMinute] = entry.startTime.split(':').map(Number)
  const [endHour, endMinute] = entry.endTime.split(':').map(Number)
  let hours = endHour + endMinute / 60 - (startHour + startMinute / 60)
  if (hours < 0) hours += 24
  return hours
}

/**
 * 건당 정산 잡은 count × 단가, 그 외는 시간 × 단가로 근사 계산한다.
 * TODO: 백엔드 정산 엔진 연동 후 이 근사 로직을 실제 API 결과로 교체.
 */
export function computeEntryIncome(entry, job) {
  if (!job) return 0
  if (job.incomeMethodLabel === '건당 정산') {
    return (entry.count ?? 0) * job.incomeAmount
  }
  return Math.round(computeEntryHours(entry) * job.incomeAmount)
}

export function computeDayFatigue(dayEntries) {
  const rated = dayEntries.filter((entry) => typeof entry.fatigue === 'number')
  if (rated.length === 0) return null
  const average = rated.reduce((sum, entry) => sum + entry.fatigue, 0) / rated.length
  return Math.round(average * 20)
}

const STATUS_BADGE = {
  planned: { label: '계획', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: '확정', className: 'bg-blue-100 text-blue-700' },
  settled: { label: '정산 완료', className: 'bg-emerald-100 text-emerald-700' },
}

export function getEntryStatusBadge(status) {
  return STATUS_BADGE[status]
}
