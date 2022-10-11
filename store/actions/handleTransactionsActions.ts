/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AnyAction } from 'redux';

import { TDispatch } from '../../interfaces/store'
import { handleCatchError } from '../../utils';
import { TransactionService } from '../../services';
import actions, { ActionTypes } from '../action-types/transactions';
import PageActions from '../action-types/page'
import { handleSetLoader as setLoading } from './handlePageLoadingAction';



export const setGiftCardAction = (payload: any, action: string): AnyAction => ({
  type: action,
  payload,
})


export const handleGetTransactions = (query = {}) =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return TransactionService
      .getTransactions(query)
      .then((res) => {
        const { data, ...pagination } = res?.data?.data;
        dispatch(setGiftCardAction(pagination, PageActions.SET_PAGINATION));

        dispatch(setGiftCardAction(data, actions.GET_TRANSACTIONS))
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

