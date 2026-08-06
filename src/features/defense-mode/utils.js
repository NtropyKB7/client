export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatNextDueLabel(nextPaymentDate) {
  if (!nextPaymentDate) return ''
  const [, month, day] = nextPaymentDate.split('-')
  return `다음 이체일 ${month}.${day}`
}
