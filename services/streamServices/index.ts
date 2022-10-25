import BaseApi from "../api/new-index";

export type PoolPayload = {
  planId: number;
  streamServiceId: number;
  name: string;
  maxMemberCount: number;
  password?: string;
  email: string;
};
class StreamService extends BaseApi {
  constructor() {
    super();
  }
  formUrl = (url: string) => `/stream_service/${url}`;

  async getStreamServices() {
    this.loadRequest();
    return this.request.get(this.formUrl(""));
  }
  async requestToJoin(data: { streamServiceId: number; customEmail?: string }) {
    this.loadRequest();
    return this.request.post(this.formUrl("request"), data);
  }

  async cancelRequest(id: number) {
    this.loadRequest();
    return this.request.post(`pool/${id}/request/cancel`);
  }

  async createPool(data: PoolPayload) {
    this.loadRequest();
    return this.request.post("pool", {
      ...data,
      paymentDate: new Date().toISOString(),
    });
  }
  async addToPool(
    poolRequestId: number,
    data: { userId: string; poolId: number }
  ) {
    this.loadRequest();
    return this.request.post(`pool/request/${poolRequestId}/resolve`, data);
  }
}

export default new StreamService();
