import HTTP from "../api";
import BaseService from "../base-service";
import { Ref } from '../../interfaces/http'


type GiftCardpayload = {
  data: {
    'action': string,
    'from': string | number,
    'sender': string,
    'postal': string,
    'msg': string,
    type?: string,
    reference: string,
    'card': {
      'code': string,
      'amount': number,
      'dest': string,
    }
  }
}

type AirtimePayload = {
  data: {
    'amount': number,
    'destination': string,
    'reference': string
    'type'?: string
  }
}

class GiftCards extends BaseService {
  protected getUrl = (url: string) => `/api/v1/${url}`;

  async getCategories() {
    return HTTP.baseApi().get(this.getUrl('giftcards/categories'));
  }

  async getServices() {
    return HTTP.baseApi().get(this.getUrl('billers/services'));
  }

  async getAvailableGiftCards(obj: { [key: string]: string } = {}) {
    const queryString = new URLSearchParams(obj).toString()
    return HTTP.baseApi().get(this.getUrl(`available-giftcards?${queryString}`));
  }


  async getLocalGiftCards() {
    return HTTP.baseApi().get(this.getUrl('available-giftcards/local'));
  }

  async getReference(amount: number, cardCode: string, tempUser: boolean) {
    let url = tempUser ? 'generate-transaction-reference' : 'generate-transaction-reference'
    if (cardCode === 'airtime') url = `${url}/airtime`

    return HTTP.baseApi().post(this.getUrl(url), { amount, card_code: cardCode });
  }

  async checkAvailablePromo() {
    return HTTP.baseApi().get(this.getUrl('promo-count'));
  }

  async verifyReference(reference: Ref) {
    return HTTP.baseApi().post(this.getUrl('verify-transaction-reference'), { reference: reference.ref, ...reference });
  }

  async getFXRates() {
    return HTTP.baseApi().get(this.getUrl('fxrates'), {})
  }

  async sendGiftCard(payload: GiftCardpayload | AirtimePayload, type?: string) {
    const retailUrl = payload.data?.type !== 'local' ? 'gift-cards/send_retail' : 'gift-cards/send_retail/sgc'
    const url = type === 'airtime' ? 'purchase/airtime' : retailUrl;
    return HTTP.baseApi().post(this.getUrl(url), payload)
  }


}

export default new GiftCards();
