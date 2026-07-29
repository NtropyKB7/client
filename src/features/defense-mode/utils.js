/**
 * (리저브 + 안전자산) ÷ 일평균지출로 버틸 수 있는 일수를 계산한다.
 * 06-2 방어모드 활성 화면의 생존가능기간 계산기에서 사용.
 */
export function computeSurvivalDays(reserve, safeAssets, dailySpend) {
  if (!dailySpend) return 0
  return Math.floor((reserve + safeAssets) / dailySpend)
}
