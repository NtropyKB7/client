/**
 * 고정지출 항목의 납입 가능 여부를 뱃지 라벨/색상으로 변환한다.
 * 06-2 방어모드 활성 화면의 고정지출 점검 리스트에서 사용.
 * @param {'ok'|'tight'|'review'} status
 */
export function getExpenseStatusBadge(status) {
  if (status === 'review') return { label: '중단 검토 필요', className: 'bg-red-100 text-red-700' }
  if (status === 'tight')
    return { label: '이번 달만 어려움', className: 'bg-amber-100 text-amber-700' }
  return { label: '정상 납입 가능', className: 'bg-emerald-100 text-emerald-700' }
}
