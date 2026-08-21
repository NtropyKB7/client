import { formatDateKey } from '@/features/calendar/utils'
import { markNotificationRead } from './api'

// 알 수 없는 타입은 아무 데도 이동하지 않는다(목록에 머무름) — 백엔드가 새 타입을 추가해도
// 클라이언트가 깨지지 않도록 하는 안전한 기본값.
const ROUTE_BY_TYPE = {
  WORK_LOG: (notification) => ({
    name: 'calendar',
    query: { date: formatDateKey(new Date(notification.createdAt)), autoConfirm: '1' },
  }),
  PAYMENT: () => ({ name: 'mypage', query: { view: 'subscription' } }),
  SAVING_GOAL: () => ({ name: 'home' }),
}

export function resolveNotificationRoute(notification) {
  const resolve = ROUTE_BY_TYPE[notification.notificationType]
  return resolve ? resolve(notification) : null
}

function invalidateNotificationQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] })
  queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
}

/**
 * 인앱 알림 목록 클릭과 push 클릭 알림이 공유하는 처리 로직: 읽음 처리 후 타입별로 이동한다.
 * @returns {Promise<boolean>} 실제로 다른 경로로 이동했는지 여부
 */
export async function openNotification(notification, { router, queryClient }) {
  try {
    await markNotificationRead(notification.notificationId)
    invalidateNotificationQueries(queryClient)
  } catch {
    // 읽음 처리 실패는 이동을 막지 않는다 — 부가 효과일 뿐, 핵심 동작이 아님
  }

  const target = resolveNotificationRoute(notification)
  if (target) {
    router.push(target)
    return true
  }
  return false
}
