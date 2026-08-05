/**
 * 잡 카테고리 → 캘린더 범례/셀 표시용 라벨·색상 매핑.
 * 04 홈, 05 캘린더 범례·날짜 셀 밑줄, JobCard 편집 폼에서 공통으로 사용.
 * report 기능의 mock 잡 데이터가 이 4종 문자열 category를 아직 쓰고 있어 유지한다(report-controller
 * 미연동, out of scope). job-controller 연동 화면은 아래 getCategoryColor를 대신 쓴다.
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

// job-controller의 실제 카테고리(GET /api/categories, 10종, categoryId 기반)용 색상 팔레트.
// 카테고리 이름은 서버에서 받아오고, 색상만 categoryId를 순환 배정해 부여한다(브랜드색 하나하나
// 수작업 배정하지 않음).
const CATEGORY_COLOR_PALETTE = [
  { colorClass: 'bg-amber-400', textClass: 'text-amber-600' },
  { colorClass: 'bg-blue-400', textClass: 'text-blue-600' },
  { colorClass: 'bg-rose-400', textClass: 'text-rose-600' },
  { colorClass: 'bg-emerald-400', textClass: 'text-emerald-600' },
  { colorClass: 'bg-violet-400', textClass: 'text-violet-600' },
  { colorClass: 'bg-cyan-400', textClass: 'text-cyan-600' },
  { colorClass: 'bg-orange-400', textClass: 'text-orange-600' },
  { colorClass: 'bg-lime-500', textClass: 'text-lime-600' },
]

const CATEGORY_COLOR_FALLBACK = { colorClass: 'bg-gray-400', textClass: 'text-gray-600' }

export function getCategoryColor(categoryId) {
  if (!categoryId) return CATEGORY_COLOR_FALLBACK
  return CATEGORY_COLOR_PALETTE[(categoryId - 1) % CATEGORY_COLOR_PALETTE.length]
}
