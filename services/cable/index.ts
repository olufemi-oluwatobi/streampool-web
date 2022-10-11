import HTTP from "../api";
import BaseService from "../base-service";
import { INVITE_TEAMMEMBER_PAYLOAD } from '../../interfaces/http'





const BAXI_HEADER = {
  headers: process.env.NODE_ENV !== 'production' ?
    { 'x-api-key': process.env.REACT_APP_BAXI_TEST_KEY } : { 'Authorization': `Api-key ${process.env.REACT_APP_BAXI_API_KEY}` }
}


class CableService extends BaseService {
  protected getUrl = (url: string) => `/api/v1/${url}`;

  async getCableOptions() {
    return HTTP.baseApi().get(this.getUrl('utility/cabletv/service-type'));
  }

  async verifyAccountNumber(data: { 'account_number': string, 'service_type': string }) {
    return HTTP.baseApi().post(this.getUrl('utility/account/validation'), data, BAXI_HEADER)
  }

  async getMultichoiceList(data: { 'service_type': string }) {
    return HTTP.baseApi().post(this.getUrl('utility/cabletv/bouquets'), data, BAXI_HEADER)
  }


  async getAddonsList(data: { 'service_type': string, 'product_code': string }) {
    return HTTP.baseApi().post(this.getUrl('utility/cabletv/bouquets'), data, BAXI_HEADER)
  }

  async getReference(amount: number, cardCode: string, isUtility = false) {
    let url: string
    if (cardCode === 'epin') url = 'generate-transaction-reference/epin'
    else {
      url = isUtility ? 'generate-transaction-reference/electricbill' : 'generate-transaction-reference/cabletv'
    }
    return HTTP.baseApi().post(this.getUrl(url), { amount, card_code: cardCode });
  }

  async renewSub(data: {
    'total_amount': number,
    'product_monthsPaidFor': number,
    'service_type': string,
    'smartcard_number': string,
    'reference': string
  }) {
    return HTTP.baseApi().post(this.getUrl('utility/cabletv/renewal'), { data });
  }




  async purchaseEpin(data: {
    'pin_value': string,
    'number_of_pins': string,
    'service_type': string,
    reference: string
  }) {
    return HTTP.baseApi().post(this.getUrl('utility/epin/request'), { data });
  }



  async changeSubscription(data: {
    'total_amount': number,
    'addon_monthsPaidFor': number,
    'addon_code': string,
    'product_code': string,
    'product_monthsPaidFor': string,
    'service_type': string,
    'smartcard_number': string,
    'reference': string
  }) {
    return HTTP.baseApi().post(this.getUrl('utility/cabletv/change-subscription'), { data });
  }

  async payUtilities(data:
    {
      'phone': string,
      'amount': number,
      'account_number': string,
      'service_type': string,
      'reference': string
    }
  ) {
    return HTTP.baseApi().post(this.getUrl('utility/electricbill/payment'), { data });
  }

  async getEpinProviders() {
    const url = 'utility/epin/providers'
    return HTTP.baseApi().get(this.getUrl(url))
  }

  async getEpinBundles(data: { 'service_type': string }) {
    return HTTP.baseApi().post(this.getUrl('utility/epin/retrieve/bundles'), data, BAXI_HEADER)
  }

}

export default new CableService();
