/**
 * 잡 카테고리 → 캘린더 범례/셀 표시용 라벨·색상 매핑.
 * 04 홈, 05 캘린더 범례·날짜 셀 밑줄, JobCard 편집 폼에서 공통으로 사용.
 */
export const JOB_CATEGORIES = [
  {
    value: 'delivery',
    label: '배달라이더',
    colorClass: 'bg-amber-400',
    textClass: 'text-amber-600',
  },
  { value: 'driving', label: '대리운전', colorClass: 'bg-blue-400', textClass: 'text-blue-600' },
  { value: 'creative', label: '크리에이터', colorClass: 'bg-rose-400', textClass: 'text-rose-600' },
  { value: 'other', label: '기타', colorClass: 'bg-gray-400', textClass: 'text-gray-600' },
]

export function getJobCategory(value) {
  return JOB_CATEGORIES.find((category) => category.value === value) ?? JOB_CATEGORIES[3]
}
