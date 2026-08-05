import PortOne from '@portone/browser-sdk/v2'
import { fetchPaymentConfig } from './api'

// CARD는 카드 발급창, KAKAOPAY/TOSSPAY는 PortOne의 EASY_PAY 발급수단 + 해당 간편결제 제공사로 매핑한다.
function buildIssueRequest(config, method) {
  const base = {
    storeId: config.storeId,
    channelKey: config.channels?.[method],
    issueName: 'Ntropy Pro 구독 결제 수단',
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
