// 100점 만점 기준 절대 점수 경계값(주의/경고). 홈 대시보드 피로도 카드, 캘린더 일별 피로도 배너에서 공통 사용.
const CAUTION_THRESHOLD = 70
const WARNING_THRESHOLD = 100

/**
 * 피로도 점수를 뱃지 라벨/색상으로 변환한다.
 * 홈 대시보드 피로도 카드, 캘린더 일별 피로도 배너에서 공통으로 사용.
 * @param {number} score 현재 점수
 * @param {number} max 점수의 최댓값(100 기준 절대 점수 경계값과 비례 환산)
 */
export function getFatigueBadge(score, max) {
  const normalized = (score / max) * 100
  if (normalized >= WARNING_THRESHOLD) {
    return { label: '경고', className: 'bg-[#FBE9E4] text-[#C1462F]', hint: '휴식이 꼭 필요해요' }
  }
  if (normalized >= CAUTION_THRESHOLD) {
    return { label: '주의', className: 'bg-amber-50 text-amber-600', hint: '휴식을 권장해요' }
  }
  return { label: '정상', className: 'bg-primary-50 text-primary-800', hint: '좋은 컨디션이에요' }
}
