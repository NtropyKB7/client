/**
 * 원 단위 금액을 "396만"/"396만원" 형태로 축약한다.
 * @param {number} amount
 * @param {boolean} withUnit "원" 접미사 포함 여부
 */
export function formatMan(amount, withUnit = true) {
  const man = Math.round(amount / 10000)
  return withUnit ? `${man}만원` : `${man}만`
}

/**
 * 전월 대비 증감률(%)을 계산한다. 전월 데이터가 없으면 null.
 * @param {number} current
 * @param {number} previous
 */
export function computeChangePercent(current, previous) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * "2026-07" 형태의 yearMonth를 "7월"로 축약한다.
 * 백엔드 응답에 monthLabel 필드가 없어 클라이언트에서 파생한다.
 * @param {string} yearMonth
 */
export function deriveMonthLabel(yearMonth) {
  const month = Number(yearMonth?.split('-')[1])
  return Number.isFinite(month) ? `${month}월` : ''
}
