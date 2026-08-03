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
