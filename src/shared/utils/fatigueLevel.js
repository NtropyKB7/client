/**
 * 피로도 점수를 뱃지 라벨/색상으로 변환한다.
 * 04 홈 대시보드 피로도 카드, 잡별 추천 근무시간 리스트에서 공통으로 사용.
 * @param {number} score 현재 점수
 * @param {number} max 점수의 최댓값(예: 5 또는 100)
 */
export function getFatigueBadge(score, max) {
  const ratio = score / max
  if (ratio >= 0.8) return { label: '경고', className: 'bg-red-100 text-red-700' }
  if (ratio >= 0.5) return { label: '주의', className: 'bg-amber-100 text-amber-700' }
  return { label: '정상', className: 'bg-emerald-100 text-emerald-700' }
}
