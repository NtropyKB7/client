/**
 * 원 단위 금액을 "396만"/"396만원" 형태로 축약한다.
 * @param {number} amount
 * @param {boolean} withUnit "원" 접미사 포함 여부
 */
export function formatMan(amount, withUnit = true) {
  const man = Math.round(amount / 10000)
  return withUnit ? `${man}만원` : `${man}만`
}
