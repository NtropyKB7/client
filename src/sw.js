import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

// push payload는 NotificationResponse와 동일한 필드(notificationId, notificationType, title,
// body, createdAt)로 온다고 가정한다 — REST 엔드포인트가 아니라 브라우저 푸시 서비스로 직접
// 전달되는 값이라 OpenAPI 스펙 대상이 아니며, 백엔드와 별도 확인이 필요하다.
self.addEventListener('push', (event) => {
  if (!event.data) return

  const payload = event.data.json()

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: {
        notificationId: payload.notificationId,
        notificationType: payload.notificationType,
        createdAt: payload.createdAt,
      },
    }),
  )
})

// SW는 인증된 API를 직접 호출할 수 없다(accessToken은 페이지 메모리에만 존재). 그래서 읽음
// 처리와 타입별 라우팅은 여기서 하지 않고, 항상 같은 진입점(/home)만 쿼리 파라미터를 담아
// 열어준다 — 실제 처리는 앱 부팅 훅(AppLayout.vue)이 그 쿼리를 읽어 수행한다.
self.addEventListener('notificationclick', (event) => {
  const { notificationId, notificationType, createdAt } = event.notification.data ?? {}
  event.notification.close()

  const params = new URLSearchParams()
  if (notificationId != null) params.set('notificationId', notificationId)
  if (notificationType) params.set('notificationType', notificationType)
  if (createdAt) params.set('createdAt', createdAt)
  const targetUrl = `/home?${params.toString()}`

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existing = clientList[0]
      if (existing && 'navigate' in existing) {
        return existing.navigate(targetUrl).then((client) => client?.focus())
      }
      return self.clients.openWindow(targetUrl)
    }),
  )
})
