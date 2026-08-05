/**
 * 캘린더 그리드/집계 계산을 담당하는 순수 함수 모음.
 * store/컴포넌트에서 공통으로 사용.
 */

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 1일 앞의 빈 칸(null)을 채운 월간 그리드를 반환한다. month는 1~12.
 */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month - 1, day))
  }
  return cells
}
