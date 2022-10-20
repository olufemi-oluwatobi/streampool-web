/* eslint-disable no-console */
/* eslint-disable dot-notation */
/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { isFalsyValue } from '../../utils';

/**
 * @name
 * @description  function initates axios instances  and passes their default values
 * @type {{growthApi:{Promise<{axios: AxiosInstance<Function}>}}
 * @return {Object}
 */

const token = 'token'
const accessToken = 'access_token'
const TEMP_TOKEN = 'TEMP_TOKEN1'

export type HeaderProps = { 'access-token': string; uid: string | number; client: string; expire?: string, 'tmp-token'?: string }

export const decodeToken = (authToken: string): string | null => {
  if (!authToken) return null
  return JSON.parse(atob(authToken.split('.')[1]))
}

export const setAccessToken = (headers?: HeaderProps): void => {
  if (headers) {
    localStorage.setItem(
      accessToken,
      JSON.stringify({
        'access-token': headers['access-token'],
        uid: headers['uid'],
        client: headers['client'],
        expire: headers['expire'],
      })
    )
    localStorage.removeItem(TEMP_TOKEN)
  }
  // }else{
  //   localStorage.removeItem(accessToken)
  //   localStorage.removeItem(accessToken)
  // }
}

const isValidToken = (authToken: string) => {
  if (!authToken) return false
  const expiry = (JSON.parse(atob(authToken.split('.')[1]))).exp;
  return (Math.floor((new Date).getTime() / 1000)) < expiry;
}

export const buildQueryString = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString;
};


export const handleInitApp = (): void => {
  const headerInfo = JSON.parse(localStorage.getItem(accessToken) || '{}');
  const tempToken = localStorage.getItem(TEMP_TOKEN) || ''
  if (isFalsyValue(headerInfo) || (tempToken && !isValidToken(tempToken))) {
    // store.dispatch({ type: userActions.LOG_OUT })
  } else {
    // store.dispatch(handleFetchUserDetails() as any);
  }
}

export default (() => {
  const baseApi = () => {
    let baseURL = process.env.NEXT_PUBLIC_API_URL
    let tokenValue: string | null = ''
    let accessTokenValue = {}

    const tempToken = localStorage.getItem(TEMP_TOKEN)
    if (localStorage.getItem(accessToken)) {
      accessTokenValue = JSON.parse(localStorage.getItem(accessToken) as string)
    }

    if (localStorage.getItem(token)) {
      tokenValue = localStorage.getItem(token)
    }

    const headers: { [key: string]: string } = { Authorization: `Bearer ${tokenValue}`, 'Content-Type': 'application/json', ...accessTokenValue }


    if (tempToken) {
      if (isValidToken(tempToken)) {
        tokenValue = tempToken
        if (headers.Authorization) { delete headers.Authorization }
        headers['tmp-token'] = tempToken

      } else {
        localStorage.removeItem(TEMP_TOKEN)
      }
    }



    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
      // TODO: switch to real environmental variable for production
      baseURL = process.env.NEXT_PUBLIC_API_URL as string
    }


    return axios.create({
      baseURL,
      headers,
    })
  }

  return { baseApi }
})()
