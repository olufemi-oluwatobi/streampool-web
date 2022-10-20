import BaseApi from "../api/new-index";

export type PoolPayload = { "planId": number, "streamServiceId": number, "name": string, "maxMemberCount": number, "password"?: string, "email": string }
class StreamService extends BaseApi {
  formUrl = (url: string) => `/stream_service/${url}`;

  async getStreamServices() {
    return this.request.get(this.formUrl(""));
  }
  async requestToJoin(data: { streamServiceId: number, customEmail?: string }) {
    return this.request.post(this.formUrl("request"), data);
  }

  async cancelRequest(id: number) {
    return this.request.post(`pool/${id}/request/cancel`)
  }

  async createPool(data: PoolPayload) {
    return this.request.post("pool", { ...data, paymentDate: new Date().toISOString() });
  }
}

export default new StreamService();
