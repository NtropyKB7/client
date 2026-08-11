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

/**
 * 브라우저 권한(위치/알림)은 페이지에서 chrome://settings/... 같은 브라우저 내부 설정 화면으로
 * 자동 이동시킬 수 없다(모든 브라우저의 보안 정책). User-Agent로 대략적인 브라우저/플랫폼을 구분해
 * 사이트 권한 설정을 직접 찾아갈 수 있는 안내 문구와, 데스크톱 브라우저는 주소창에 붙여넣을 수 있는
 * 설정 경로(copyText)를 함께 제공한다.
 * @param {'location'|'notification'} permission
 * @returns {{ browserLabel: string, steps: string[], copyText: string|null }}
 */
export function getBrowserSettingsGuide(permission) {
  const ua = navigator.userAgent
  const permissionLabel = permission === 'location' ? '위치' : '알림'
  const isIOS = /iPhone|iPad|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)
  const isFirefox = /Firefox/.test(ua)
  const isEdge = /Edg\//.test(ua)
  const isChrome = /Chrome/.test(ua) && !isEdge
  const isSafari = /Safari/.test(ua) && !isChrome && !isEdge

  if (isIOS) {
    return {
      browserLabel: 'iPhone/iPad',
      steps: [
        '기기의 설정 앱을 열어요.',
        'Safari 항목으로 이동해요.',
        `${permissionLabel} 관련 항목에서 이 웹사이트의 권한을 변경해요.`,
      ],
      copyText: null,
    }
  }

  if (isAndroid && isChrome) {
    return {
      browserLabel: 'Chrome(Android)',
      steps: [
        '주소창 왼쪽의 자물쇠(또는 정보) 아이콘을 눌러요.',
        `${permissionLabel === '위치' ? '위치' : '알림'} 권한을 찾아 변경해요.`,
      ],
      copyText: null,
    }
  }

  if (isFirefox) {
    return {
      browserLabel: 'Firefox',
      steps: [
        '주소창에 아래 주소를 붙여넣고 이동해요.',
        '개인정보 및 보안 > 권한에서 이 웹사이트를 찾아 변경해요.',
      ],
      copyText: 'about:preferences#privacy',
    }
  }

  if (isEdge) {
    return {
      browserLabel: 'Edge',
      steps: ['주소창에 아래 주소를 붙여넣고 이동해요.', '이 웹사이트를 찾아 권한을 변경해요.'],
      copyText: `edge://settings/content/${permission === 'location' ? 'location' : 'notifications'}`,
    }
  }

  if (isChrome) {
    return {
      browserLabel: 'Chrome',
      steps: ['주소창에 아래 주소를 붙여넣고 이동해요.', '이 웹사이트를 찾아 권한을 변경해요.'],
      copyText: `chrome://settings/content/${permission === 'location' ? 'location' : 'notifications'}`,
    }
  }

  if (isSafari) {
    return {
      browserLabel: 'Safari',
      steps: [
        '상단 메뉴에서 Safari > 설정을 열어요.',
        '웹사이트 탭에서 위치 및 알림 항목을 찾아 이 웹사이트의 권한을 변경해요.',
      ],
      copyText: null,
    }
  }

  return {
    browserLabel: '브라우저',
    steps: ['브라우저 설정 메뉴에서 사이트 권한(또는 개인정보 보호) 항목을 찾아 변경해요.'],
    copyText: null,
  }
}
