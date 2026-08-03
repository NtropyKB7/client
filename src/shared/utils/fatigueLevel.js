/**
 * 피로도 점수를 뱃지 라벨/색상으로 변환한다.
 * 04 홈 대시보드 피로도 카드, 잡별 추천 근무시간 리스트에서 공통으로 사용.
 * @param {number} score 현재 점수
 * @param {number} max 점수의 최댓값(예: 5 또는 100)
 */
export function getFatigueBadge(score, max) {
  const ratio = score / max
  if (ratio >= 0.8) {
    return { label: '경고', className: 'bg-[#FBE9E4] text-[#C1462F]', hint: '휴식이 꼭 필요해요' }
  }
  if (ratio >= 0.5) {
    return { label: '주의', className: 'bg-[#FBE9E4] text-[#C1462F]', hint: '휴식을 권장해요' }
  }
  return { label: '정상', className: 'bg-primary-50 text-primary-800', hint: '좋은 컨디션이에요' }
}
