import { requestWithMock } from '@/shared/api/request'

const MOCK_PROFILE = {
  name: '김동현',
  email: 'kdongh0406@gmail.com',
  avatarLabel: '동현',
}

const MOCK_SUBSCRIPTION = {
  planId: 'pro',
  status: 'ACTIVE',
  startedAt: '2026-07-13',
  nextBillingDate: '2026-08-16',
  autoRenew: true,
  cancelRequestedAt: null,
  paymentMethod: { label: '신한 카드', maskedNumber: '**** 1111' },
}

const MOCK_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    description: '대시보드, 캘린더, 소득 분석',
    priceLabel: '무료',
    price: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Basic 모든 기능, 방어모드, AI 리포트 제공',
    priceLabel: '4,900 ₩ / 월',
    price: 4900,
  },
]

const MOCK_PAYMENT_HISTORY = [
  {
    id: 'payment-3',
    label: 'Pro 정기결제',
    date: '2026-07-16',
    amount: 4900,
    status: 'SUCCESS',
    receiptUrl: 'https://receipt.portone.io/mock/payment-3',
  },
  { id: 'payment-2', label: 'Pro 정기결제', date: '2026-06-16', amount: 4900, status: 'SUCCESS' },
  { id: 'payment-1', label: 'Pro 정기결제', date: '2026-05-16', amount: 4900, status: 'SUCCESS' },
]

const MOCK_PAYMENT_CONFIG = {
  storeId: '',
  channels: { CARD: '', KAKAOPAY: '', TOSSPAY: '' },
  customerId: '',
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'noti-1',
    title: '7월 28일 근무 확인 알림',
    timeRangeLabel: '11:00 - 15:00',
    detailLabel: '배달 3건',
    fatigueLabel: '피로도 보통',
  },
  {
    id: 'noti-2',
    title: '7월 26일 근무 확인 알림',
    timeRangeLabel: '19:00 - 23:00',
    detailLabel: '대리운전 2건',
    fatigueLabel: '피로도 힘듦',
  },
]

const PLAN_NAME_BY_CODE = { BASIC: 'Basic', PRO: 'Pro' }

function toDateLabel(isoDateTime) {
  return isoDateTime ? isoDateTime.slice(0, 10) : null
}

function normalizeProfile(data) {
  return {
    name: data.name,
    email: data.email,
    avatarLabel: (data.name ?? '').slice(-2),
  }
}

function normalizeSubscription(data) {
  return {
    planId: (data.planCode ?? 'BASIC').toLowerCase(),
    status: data.status,
    startedAt: toDateLabel(data.startDate),
    nextBillingDate: toDateLabel(data.endDate),
    autoRenew: data.autoRenewYn ?? false,
    cancelRequestedAt: data.cancelRequestedAt,
    paymentMethod: data.paymentMethod
      ? { label: data.paymentLabel ?? data.paymentMethod, maskedNumber: data.paymentMasked ?? '' }
      : null,
  }
}

function normalizePlans(data) {
  return (data.plans ?? []).map((plan) => ({
    id: plan.planCode.toLowerCase(),
    name: plan.planName,
    description: (plan.features ?? []).join(', '),
    priceLabel: plan.price === 0 ? '무료' : `${plan.price.toLocaleString()} ₩ / 월`,
    price: plan.price,
  }))
}

function normalizePaymentHistory(data) {
  return (data.payments ?? []).map((item) => ({
    id: `payment-${item.paymentId}`,
    label: `${PLAN_NAME_BY_CODE[item.planCode] ?? item.planCode} 정기결제`,
    date: toDateLabel(item.createdAt),
    amount: item.amount,
    status: item.paymentStatus,
    failureReason: item.failureReason,
    receiptUrl: item.receiptUrl,
  }))
}

export async function fetchProfile() {
  return requestWithMock(MOCK_PROFILE, (client) =>
    client.get('/users/me').then((response) => ({ data: normalizeProfile(response.data) })),
  )
}

// 정보수정/탈퇴 UI 진입점은 아직 없음 — 함수만 준비해둔다.
export async function updateProfile(payload) {
  return requestWithMock(null, (client) => client.put('/users/me', payload))
}

export async function deleteAccount() {
  return requestWithMock(null, (client) => client.delete('/users/me'))
}

export async function fetchSubscription() {
  return requestWithMock(MOCK_SUBSCRIPTION, (client) =>
    client.get('/subscriptions').then((response) => ({ data: normalizeSubscription(response.data) })),
  )
}

export async function fetchPlans() {
  return requestWithMock(MOCK_PLANS, (client) =>
    client.get('/subscriptions/plans').then((response) => ({ data: normalizePlans(response.data) })),
  )
}

export async function fetchPaymentHistory() {
  return requestWithMock(MOCK_PAYMENT_HISTORY, (client) =>
    client
      .get('/subscriptions/payments')
      .then((response) => ({ data: normalizePaymentHistory(response.data) })),
  )
}

// PortOne billingKey 발급에 필요한 storeId/채널키. mypage/payment.js에서만 소비한다.
export async function fetchPaymentConfig() {
  return requestWithMock(MOCK_PAYMENT_CONFIG, (client) => client.get('/subscriptions/config'))
}

// 해지 예약(다음 결제일부터 Basic 전환) / 예약 취소. 즉시 플랜을 바꾸는 API는 없음.
export async function cancelSubscription() {
  return requestWithMock(null, (client) => client.post('/subscriptions/cancel'))
}

export async function revokeCancel() {
  return requestWithMock(null, (client) => client.delete('/subscriptions/cancel'))
}

export async function initSubscription({ billingKey }) {
  return requestWithMock(null, (client) => client.post('/subscriptions', { billingKey }))
}

export async function updatePaymentMethod({ billingKey }) {
  return requestWithMock(null, (client) => client.post('/subscriptions/payment-method', { billingKey }))
}

export async function fetchNotifications() {
  return requestWithMock(MOCK_NOTIFICATIONS, (client) => client.get('/mypage/notifications'))
}
