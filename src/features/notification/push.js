import { fetchPushPublicKey, registerPushSubscription, unregisterPushSubscription } from './api'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

function toSubscriptionPayload(subscription) {
  const { endpoint, keys } = subscription.toJSON()
  return { endpoint, keys }
}

// 이미 구독이 있으면(정상 상태거나, 서버에만 등록이 빠진 상태) 그대로 서버에 재등록하고,
// 없으면(만료 등) 새로 구독한다. 토글 직후(권한 승인 직후)와 부팅 시 재확인(ensurePushSubscription)
// 양쪽에서 공유하는 핵심 로직.
export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    const publicKey = await fetchPushPublicKey()
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }

  await registerPushSubscription(toSubscriptionPayload(subscription))
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return

  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return

  try {
    await unregisterPushSubscription(subscription.endpoint)
  } finally {
    await subscription.unsubscribe()
  }
}

// 브라우저 알림 권한이 이미 'granted'인데 활성 구독이 없는 경우(만료, 재로그인 등)를 사용자
// 재조작 없이 복구한다. requestPermission()은 호출하지 않는다 — 권한 프롬프트는 사용자
// 제스처 밖에서 뜨면 안 되므로, 이미 확정된 권한 상태일 때만 진행한다.
export async function ensurePushSubscription() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    await subscribeToPush()
  } catch {
    // best-effort 재시도 — 실패해도 다음 부팅 때 다시 시도한다.
  }
}
