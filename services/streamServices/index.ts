import { PoolCredentials } from "@interfaces/index";
import BaseApi from "../api/new-index";

export type PoolPayload = {
  planId: number;
  streamServiceId: number;
  name: string;
  maxMemberCount: number;
  password?: string;
  email: string;
  paymentDate: string;
  type: string;
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
  async requestToJoin(data: {
    streamServiceId: number;
    customEmail?: string;
    poolId?: number;
  }) {
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
    });
  }

  async disablePool(poolId: number) {
    this.loadRequest();
    return this.request.post(`pool/${poolId}/disable`);
  }

  async editPoolCredentials(
    poolId: number,
    data: { password: string; accountEmail: string }
  ) {
    this.loadRequest();
    return this.request.post(
      `pool/${poolId}/edit_credential
    `,
      data
    );
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
