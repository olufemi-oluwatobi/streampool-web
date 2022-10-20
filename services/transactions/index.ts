import BaseService from '../base-service';
import HTTP, { buildQueryString } from '../api';



class GiftCards extends BaseService {
  constructor() {
    super()
  }
  protected getUrl = (url: string) => `/api/v1/${url}`;

  async getTransactions(query: { [key: string]: any } = {}) {
    const queryParams = buildQueryString(query)
    return HTTP.baseApi().get(this.getUrl(`fetch-send-transactions?${queryParams}`));
  }
}

export default new GiftCards();
