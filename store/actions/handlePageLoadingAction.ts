import { AnyAction } from 'redux';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThunkDispatch } from 'redux-thunk';
import type from '../action-types/page';

/**
 * types for reducer action
 */
const { LOADING_PAGE } = type;
/**
 * @name handleSetUser
 * @description redux action function passes payload and action for reducer
 * @param {Object} payload
 * @return {NUll} null
 */
export const handleSetLoader = (payload: boolean): AnyAction => ({
  type: LOADING_PAGE,
  payload,
});

/**
 * @name handlePageLoader
 * @description  function handles page loader
 * @param {Object} value
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */

export const handlePageLoader = (value: boolean) => (dispatch: ThunkDispatch<any, any, any>): void => {
  dispatch(handleSetLoader(value));
};
