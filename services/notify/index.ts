import BaseApi from "../api/new-index";

class NotifyService extends BaseApi {
    formUrl = (url: string) => `/stream_service/${url}`;

    async getStreamServices() {
        return this.request.get(this.formUrl(""));
    }
    async requestToJoin(data: { streamServiceId: number, customEmail?: string }) {
        return this.request.post(this.formUrl("request"), data);
    }
}

export default new NotifyService();
