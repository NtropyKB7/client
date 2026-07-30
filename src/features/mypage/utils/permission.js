/**
 * navigator.permissions.query 결과를 조회한다. 미지원 브라우저는 'unsupported'를 반환한다.
 * @param {'geolocation'|'notifications'} name
 * @returns {Promise<'granted'|'denied'|'prompt'|'unsupported'>}
 */
export async function queryPermissionStatus(name) {
  if (!navigator.permissions?.query) return 'unsupported'
  try {
    const status = await navigator.permissions.query({ name })
    return status.state
  } catch {
    return 'unsupported'
  }
}

/**
 * 위치 권한을 요청한다. getCurrentPosition 호출 자체가 브라우저 권한 프롬프트를 띄운다.
 * @returns {Promise<'granted'|'denied'|'unsupported'>}
 */
export function requestGeolocationPermission() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve('unsupported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => resolve('granted'),
      () => resolve('denied'),
    )
  })
}

/**
 * 알림 권한을 요청한다.
 * @returns {Promise<'granted'|'denied'|'default'|'unsupported'>}
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.requestPermission()
}
