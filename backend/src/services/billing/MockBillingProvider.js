import crypto from 'crypto';
export class MockBillingProvider{
  async createCheckout({order,returnUrl}){const id=`mock_checkout_${crypto.randomUUID()}`,separator=returnUrl.includes('?')?'&':'?';return{id,url:`${returnUrl}${separator}mockCheckout=${id}`,provider:'mock'};}
  async createSubscriptionCheckout({order,returnUrl}){const id=`mock_subscription_${crypto.randomUUID()}`,separator=returnUrl.includes('?')?'&':'?';return{id,url:`${returnUrl}${separator}mockSubscription=${id}`,provider:'mock'};}
}
