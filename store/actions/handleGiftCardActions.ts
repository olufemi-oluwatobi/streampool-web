/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AnyAction } from 'redux';

import { TDispatch, ThunkActionResponse } from '../../interfaces'
import { handleCatchError } from '../../utils'
import { handleSetLoader as setLoading } from './handlePageLoadingAction';
import { GiftCardService } from '../../services';
import actions, { ActionTypes } from '../../store/action-types/giftcards';
import cableAction, { ActionTypes as CableActionTypes } from '../../store/action-types/cable';



export const setGiftCardAction = (payload: any, action: ActionTypes | CableActionTypes): AnyAction => ({
  type: { ...actions, ...cableAction }[action],
  payload,
})

/**
 * @name stageGiftCard
 * @description  function set current gift card to be purchased
 * @param {Null}
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */

export const stageGiftCard =
  (id: number | string, type: 'cable' | 'giftcard' = 'giftcard') =>
    (dispatch: TDispatch) => {
      dispatch(setGiftCardAction(id, type === 'giftcard' ? ActionTypes.STAGE_GIFT_CARD : CableActionTypes.STAGE_CABLE))
    }



/**
 * @name handleFetchGiftCards
 * @description  function gets available gift cards
 * @param {Null}
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */

export const handleFetchGiftCards =
  (obj: { [key: string]: string } = {}) =>
    (dispatch: TDispatch): ThunkActionResponse => {
      const requestObj = { ...obj }
      dispatch(setLoading(true))

      // TODO MAKE CATEGORY DYNAMIC
      return GiftCardService.getAvailableGiftCards(requestObj)
        .then((res) => {

          const hasQuery = Object.values(requestObj).filter(val => val).length;
          const action = hasQuery ? ActionTypes.SEARCH_GIFT_CARD : ActionTypes.GET_AVAILABLE_GIFT_CARDS;


          const data = hasQuery ? { data: res.data.data.data, query: requestObj } : res.data.data.data;

          dispatch(setGiftCardAction(data, action))
        })
        .catch((error) => {
          handleCatchError(error)
        })
        .finally(() => {
          dispatch(setLoading(false))
        })
    }

export const fetchGiftCardCategories =
  () =>
    (dispatch: TDispatch): ThunkActionResponse => {
      dispatch(setGiftCardAction(true, ActionTypes.LOADING_GIFT_CARD))
      return GiftCardService.getCategories()
        .then((res) => {
          dispatch(
            setGiftCardAction(res?.data?.data?.categories?.filter((cat: { id: string, title: string }) => cat.title), ActionTypes.GET_CATEGORIES))
        })
        .catch(handleCatchError)
        .finally(() => {
          dispatch(setGiftCardAction(false, ActionTypes.LOADING_GIFT_CARD))
        })
    }


export const fetchServices =
  () =>
    (dispatch: TDispatch): ThunkActionResponse => {
      // dispatch(setGiftCardAction(true, ActionTypes.LOADING_GIFT_CARD))
      return GiftCardService.getServices()
        .then((res) => {
          const { biller_services: billService } = res?.data?.data
          const eTransfers = billService.filter(({ service_type: serviceType }: { [key: string]: any }) => serviceType === 'digiftngetransfer')
          dispatch(
            setGiftCardAction(eTransfers, ActionTypes.GET_SERVICES))
        })
        .catch(handleCatchError)
        .finally(() => {
          // dispatch(setGiftCardAction(false, ActionTypes.LOADING_GIFT_CARD))
        })
    }
