/* eslint-disable */
import HTTP from "../api";
import BaseService from "../base-service";
import { INVITE_TEAMMEMBER_PAYLOAD } from '../../interfaces/http'

class BusinessService extends BaseService {
  protected getUrl = (url: string) => `/api/v1/business/${url}`;

  async toggleLiveMode(test_mode: boolean) {
    return HTTP.baseApi().patch(this.getUrl('go-live'), { data: { test_mode } });
  }

  async getWallets() {
    return HTTP.baseApi().get(this.getUrl('wallet'), { data: {} });
  }

  async getTeams() {
    return HTTP.baseApi().get(this.getUrl("team"))
  }

  async verifyInviteToken(inviteCode: string) {
    return HTTP.baseApi().get(this.getUrl(`verify-team-invite?invite_code=${inviteCode}`))
  }

  async inviteTeamMember(data: INVITE_TEAMMEMBER_PAYLOAD) {
    return HTTP.baseApi().post(this.getUrl("send-team-invite"), { data })
  }

  async removeTeamMember(memberId: string | number) {
    return HTTP.baseApi().delete(this.getUrl(`team-member/remove/${memberId}`))
  }

}

export default new BusinessService();
