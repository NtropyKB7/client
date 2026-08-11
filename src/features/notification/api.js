import { requestWithMock } from '@/shared/api/request'

const MOCK_NOTIFICATIONS = [
  {
    notificationId: 3,
    title: '8월 10일 근무 확인 알림',
    body: '어제 등록한 근무 기록을 확인해주세요.',
    notificationType: 'WORK_LOG',
    createdAt: '2026-08-10T21:00:00',
    readAt: null,
  },
  {
    notificationId: 2,
    title: '구독 결제 완료',
    body: 'Pro 플랜 정기결제가 완료되었어요.',
    notificationType: 'PAYMENT',
    createdAt: '2026-08-05T10:15:00',
    readAt: null,
  },
  {
    notificationId: 1,
    title: '이번 달 저축 목표 달성',
    body: '설정하신 저축 목표를 달성했어요! 축하드려요.',
    notificationType: 'SAVING_GOAL',
    createdAt: '2026-07-30T09:00:00',
    readAt: '2026-07-30T12:00:00',
  },
]

const MOCK_NOTIFICATIONS_RESPONSE = {
  notifications: MOCK_NOTIFICATIONS,
  page: 0,
  size: 20,
  totalElements: MOCK_NOTIFICATIONS.length,
  totalPages: 1,
  hasNext: false,
}

// MOCK_NOTIFICATIONS 중 readAt이 null인 개수(2건)와 일치시킨다.
const MOCK_UNREAD_COUNT = 2

export async function fetchNotifications({ page = 0, size = 20 } = {}) {
  return requestWithMock(MOCK_NOTIFICATIONS_RESPONSE, (client) =>
    client.get('/notifications', { params: { page, size } }),
  )
}

export async function fetchUnreadCount() {
  return requestWithMock(MOCK_UNREAD_COUNT, (client) =>
    client
      .get('/notifications/unread-count')
      .then((response) => ({ data: response.data.unreadCount })),
  )
}

export async function markNotificationRead(notificationId) {
  return requestWithMock(null, (client) => client.patch(`/notifications/${notificationId}/read`))
}

export async function deleteNotification(notificationId) {
  return requestWithMock(null, (client) => client.delete(`/notifications/${notificationId}`))
}
