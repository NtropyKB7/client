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
 * "2026-07" 형태의 yearMonth를 "7월"로 축약한다.
 * 백엔드 응답에 monthLabel 필드가 없어 클라이언트에서 파생한다.
 * @param {string} yearMonth
 */
export function deriveMonthLabel(yearMonth) {
  const month = Number(yearMonth?.split('-')[1])
  return Number.isFinite(month) ? `${month}월` : ''
}

/**
 * 분 단위 근무시간을 "N시간 M분" 형태로 변환한다(분이 0이면 "N시간"만).
 * @param {number} totalMinutes
 */
export function formatWorkMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`
}
