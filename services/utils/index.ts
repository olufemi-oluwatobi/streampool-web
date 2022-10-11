/* eslint-disable class-methods-use-this */

import BaseService from '../base-service';
import axios, { AxiosResponse } from 'axios';


type VerfificationResponse = {
  'id': string,
  'recipient': string,
  'primary_line': string,
  'secondary_line': string,
  'urbanization': string,
  'last_line': string,
  'deliverability': 'undeliverable' | 'deliverable',
  'lob_confidence_score': {
    'score': number,
    'level': string
  },
  'object': string
}
class Utils extends BaseService {
  protected getUrl = (url: string) => `/api/v1/${url}`;

  protected getVerificationUrl = (url: string) => `https://api.lob.com/v1/${url}`;

  async verifyUSAddress(data: { address: string }): Promise<AxiosResponse<VerfificationResponse>> {
    const verificationKey = (process.env.REACT_APP_LOB_API_KEY as string)
    const config = { auth: { username: verificationKey, password: '' } }
    return axios.post(this.getVerificationUrl('us_verifications'), data, config)
  }


  async verifyBVN(data: { bvn: string, selfieImage: string }) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_BVN_VERIFICATION_KEY,
        AppId: process.env.REACT_APP_BVN_VERIFICATION_APP
      }
    };


    // TODO: use env variable

    const url = (process.env.REACT_APP_BVN_VERIFICATION_URL as string);
    return axios.post(url, { bvn: data.bvn, 'selfie_image': data.selfieImage }, options)
  }

}

export default new Utils();
