import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay } from '@/shared/api/mockDelay'

export const CAUSE_OPTIONS = [
  { id: 'accident', label: '사고' },
  { id: 'illness', label: '질병' },
  { id: 'account_suspended', label: '계정정지' },
  { id: 'equipment_failure', label: '장비고장' },
  { id: 'childcare', label: '육아·돌봄' },
  { id: 'other', label: '기타' },
]

const MOCK_DEFENSE_DATA = {
  finance: {
    reserve: 1280000,
    safeAssets: 3400000,
    dailySpend: 110000,
    expectedLossIncome: -1450000,
  },
  fixedExpenses: [
    {
      id: 'expense-1',
      name: '대출상환',
      amount: 500000,
      nextDueLabel: '다음 이체일 08.05',
      status: 'ok',
    },
    {
      id: 'expense-2',
      name: '실비 보험료',
      amount: 500000,
      nextDueLabel: '다음 이체일 08.10',
      status: 'tight',
    },
    {
      id: 'expense-3',
      name: 'OTT 구독료',
      amount: 280000,
      nextDueLabel: '다음 이체일 08.14',
      status: 'review',
    },
  ],
  // TODO: 백엔드에서 원인별 실제 보험 청구 항목 API 연동 후 이 mock 매핑을 교체.
  insuranceChecklistByCause: {
    accident: [
      { id: 'accident-1', label: '사고 발생 경위서 작성' },
      { id: 'accident-2', label: '산재보험 요양급여 신청' },
      { id: 'accident-3', label: '자동차보험(대리운전 특약) 청구' },
    ],
    illness: [
      { id: 'illness-1', label: '진단서 발급 신청' },
      { id: 'illness-2', label: '실비보험 통원치료비 청구' },
      { id: 'illness-3', label: '상병수당 신청 대상 확인' },
    ],
    account_suspended: [
      { id: 'account-1', label: '계정 정지 사유서 제출' },
      { id: 'account-2', label: '플랫폼 고객센터 이의신청 접수' },
      { id: 'account-3', label: '대체 플랫폼 등록 진행' },
    ],
    equipment_failure: [
      { id: 'equipment-1', label: '장비 파손·분실 신고서 작성' },
      { id: 'equipment-2', label: '장비 보증·AS 접수' },
      { id: 'equipment-3', label: '플랫폼 장비지원금 신청' },
    ],
    childcare: [
      { id: 'childcare-1', label: '돌봄 공백 증빙서류 준비' },
      { id: 'childcare-2', label: '아이돌봄서비스 바우처 신청' },
      { id: 'childcare-3', label: '긴급 돌봄지원금 신청' },
    ],
    other: [
      { id: 'other-1', label: '상황 증빙자료 준비' },
      { id: 'other-2', label: '고객센터 문의 접수' },
      { id: 'other-3', label: '플랫폼사 특별지원 제도 확인' },
    ],
  },
}

export async function fetchDefenseModeData() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_DEFENSE_DATA // TODO: 백엔드 위기대응 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/defense-mode')
  return data
}
