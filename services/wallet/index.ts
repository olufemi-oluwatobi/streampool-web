/* eslint-disable */
import HTTP from "../api";
import BaseService from "../base-service";

class WalletService extends BaseService {
  protected getUrl = (url: string) => `/api/v1/${url}`;

  async getReference(amount: number) {
    return HTTP.baseApi().post(this.getUrl('generate-fundwallet-reference'), { amount });
  }


  async verifyReference(reference: string) {
    return HTTP.baseApi().post(this.getUrl('verify-fundwallet-reference'), { reference });
  }
}

export default new WalletService();
