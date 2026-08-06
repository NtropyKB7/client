import PortOne from '@portone/browser-sdk/v2'
import { fetchPaymentConfig } from './api'

// CARD는 카드 발급창, KAKAOPAY/TOSSPAY는 PortOne의 EASY_PAY 발급수단 + 해당 간편결제 제공사로 매핑한다.
// customerId는 GET /subscriptions/config에서 내려주며, 토스페이먼츠(및 스마트로)의 빌링키
// 발급 시 PortOne이 요구하는 구매자 식별자다. 다른 PG는 무시하므로 항상 넣어도 안전하다.
function buildIssueRequest(config, method) {
  const base = {
    storeId: config.storeId,
    channelKey: config.channels?.[method],
    issueName: 'Ntropy Pro 구독 결제 수단',
    customer: config.customerId ? { customerId: config.customerId } : undefined,
  }
  if (method === 'CARD') {
    return { ...base, billingKeyMethod: 'CARD' }
  }
  return { ...base, billingKeyMethod: 'EASY_PAY', easyPay: { easyPayProvider: method } }
}

// PortOne 결제창을 띄워 카드/간편결제 등록을 받고 billingKey를 발급받는다.
// storeId/channelKey는 GET /subscriptions/config에서 내려받는다.
export async function issueBillingKey(method) {
  const config = await fetchPaymentConfig()
  const response = await PortOne.requestIssueBillingKey(buildIssueRequest(config, method))

  if (!response || response.code) {
    throw new Error(response?.message ?? '결제 수단 등록에 실패했어요. 잠시 후 다시 시도해주세요.')
  }
  return response.billingKey
}

// PortOne SDK는 결제/빌링키 발급 UI를 이 id의 래퍼로 body에 직접 삽입한다(#imp-iframe-wrapper).
// 카카오페이 QR 등 일부 결제수단은 이 오버레이 자체의 닫기 버튼이 응답하지 않는 경우가 있고,
// 그러면 우리 모달의 닫기 버튼도 오버레이(z-index 99999)에 가려 눌리지 않아 사용자가 갇힌다.
// issueBillingKey의 Promise가 끝내 응답하지 않을 수 있으므로, 호출부에서 이 함수로 오버레이를
// 강제로 제거하고 자체적으로 로딩 상태를 풀어 탈출구를 제공한다.
export function forceCloseBillingKeyUI() {
  document.getElementById('imp-iframe-wrapper')?.remove()
}
