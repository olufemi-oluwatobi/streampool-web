/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AnyAction } from 'redux';

import { TDispatch } from '../../interfaces/store'
import { handleCatchError } from '../../utils';
import { CableService } from '../../services';
import actions, { ActionTypes } from '../action-types/cable';
import { handleSetLoader as setLoading } from './handlePageLoadingAction';



export const setBusinessAction = (payload: any, action: ActionTypes): AnyAction => ({
  type: actions[action],
  payload,
})


export const getCableOptions =
  () =>
    (dispatch: TDispatch) => {
      dispatch(setLoading(true))

      return CableService.getCableOptions()
        .then((res) => {
          dispatch(setBusinessAction(res.data.data, ActionTypes.GET_CABLE_OPTIONS))
        })
        .catch(handleCatchError)
        .finally(() => { dispatch(setLoading(false)) })
    }


export const getEpinServices =
  () =>
    (dispatch: TDispatch) => {
      dispatch(setLoading(true))

      return CableService.getEpinProviders()
        .then((res) => {
          dispatch(setBusinessAction(res.data.data.providers, ActionTypes.GET_EPIN_PROVIDERS))
        })
        .catch(handleCatchError)
        .finally(() => { dispatch(setLoading(false)) })
    }



