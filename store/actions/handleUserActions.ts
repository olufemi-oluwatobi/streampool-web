/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable object-curly-newline */

import { batch } from 'react-redux';
import { AnyAction } from 'redux';

import {
  TDispatch, ThunkActionResponse,
  BusinessRegistrationPayload,
  UserPasswordPayload,
  ResetPasswordPayload,
  PersonalRegistrationPayload,
  LoginPayload,
  UserProfileSettingsPayload,
  ResetPasswordHeaders,
  ForgotPasswordPayload
} from '../../interfaces'
import { handleCatchError } from '../../utils'
import { setAccessToken, UserService, HeaderProps, NotifyService, BusinessService } from '../../services';

import { persistor } from '../../store';
import actions from '../../store/action-types/user';
import { handleSetLoader as setLoading } from './handlePageLoadingAction';

/**
 * @name handleSetUser
 * @description redux action function passes payload and action for reducer
 * @param {Object} payload
 * @return {Null} null
 */
export const handleSetUser = (payload: any): AnyAction => ({
  type: actions.SET_USER,
  payload,
})

/**
 * @name handleFetchUserDetails
 * @description  function gets User details
 * @param {Null}
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const handleFetchUserDetails =
  () =>
    (dispatch: TDispatch): ThunkActionResponse => {
      dispatch(setLoading(true))

      return UserService.getProfile()
        .then((res) => {
          dispatch(handleSetUser(res.data.data))
          localStorage.removeItem('TEMP_TOKEN')
        })
        .catch((error) => {
          handleCatchError(error)
          dispatch({ type: actions.LOG_OUT })
        })
        .finally(() => dispatch(setLoading(false)))
    }

/**
 * @name handleUserRegister
 * @description  function handles user registration
 * @param {Object} data
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const handleRegisterBusiness = (data: BusinessRegistrationPayload) =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return UserService
      .registerBusiness(data)
      .then((res) => {

        if (Object.keys(res.headers).length > 0) {
          setAccessToken((res.headers as unknown as HeaderProps))
        }

        NotifyService
          .setTitle('Success')
          .setMessage(`Please check your email ${res.data.data.email} to verify your account`)
          .success();

        return true;
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

export const handleRegisterPersonal = (data: PersonalRegistrationPayload, type: 'regular' | 'team_member') =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return UserService
      .registerPersonal(data, type)
      .then((res) => {
        if (Object.keys(res.headers).length > 0) {
          setAccessToken((res.headers as unknown as HeaderProps))
          // if(res.headers['tmp-token']){
          //   dispatch({type: actions.SET_TEMP_USER, payload: decodeToken(res.headers['tmp-token'] as string) })
          // }else{
          dispatch(handleFetchUserDetails())
          dispatch({ type: actions.SET_TEMP_USER, payload: null })

          // }
        }

        NotifyService
          .setTitle('Success')
          .setMessage(`Please check your email ${res.data.data.email} to verify your account`)
          .success();

        return true;
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

export const toggleLiveMode = (data: boolean) =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return BusinessService.toggleLiveMode(!data)
      .then((res) => {
        NotifyService
          .setTitle('Success')
          .setMessage(res.data.data.test_mode ? 'You are now on test mode' : 'You are now on live mode')
          .success();
        dispatch({ type: actions.TOGGLE_LIVE_MODE, payload: res.data.data.test_mode })
        return true;
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

export const getWallets = () =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return BusinessService.getWallets()
      .then((res) => {
        dispatch({ type: actions.GET_WALLETS, payload: res.data.data.wallet })
        return true;
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }


export const updateUserProfile = (data: UserProfileSettingsPayload) =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return UserService
      .updateSettings(data)
      .then(() => {
        NotifyService
          .setTitle('Success')
          .setMessage('Your profile was succesfully updated`')
          .success();
        dispatch(handleFetchUserDetails())
        return true
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

export const updateUserPassword = (data: UserPasswordPayload) =>
  (dispatch: TDispatch): Promise<boolean | void> => {
    dispatch(setLoading(true));

    return UserService
      .updatePassword(data)
      .then(() => {
        NotifyService
          .setTitle('Success')
          .setMessage('Password Updated`')
          .success();
        return true
      })
      .catch(handleCatchError)
      .finally(() => dispatch(setLoading(false)));
  }

/**
 * @name handleUserLogin
 * @description  function handles user logins
 * @param {Object} data
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const handleUserLogin =
  (data: LoginPayload) =>
    (dispatch: TDispatch): Promise<boolean | void> => {
      dispatch(setLoading(true))

      return UserService.signIn(data)
        .then((res) => {
          if (Object.keys(res.headers).length > 0) {
            setAccessToken((res.headers as unknown as HeaderProps))
          }

          if (Object.keys(res.data.data).length > 0) {
            dispatch(handleFetchUserDetails())
          }

          return true
        })
        .catch(handleCatchError)
        .finally(() => dispatch(setLoading(false)))
    }


/**
 * @name handleForgotPassword
 * @description  function handles user logins
 * @param {Object} data
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const handleForgotPassword =
  (data: ForgotPasswordPayload) =>
    (dispatch: TDispatch): Promise<boolean | void> => {
      dispatch(setLoading(true))

      return UserService.forgotPassword(data)
        .then(() => {
          return true
        })
        .catch(handleCatchError)
        .finally(() => dispatch(setLoading(false)))
    }

/**
 * @name handleForgotPassword
 * @description  function handles user logins
 * @param {Object} data
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const resetPassword =
  (data: ResetPasswordPayload, headers: ResetPasswordHeaders) =>
    (dispatch: TDispatch): Promise<boolean | void> => {
      dispatch(setLoading(true))

      return UserService.resetPassword(data, headers)
        .then(() => {
          return true
        })
        .catch(handleCatchError)
        .finally(() => dispatch(setLoading(false)))
    }

/**
 * @name handleUserLogout
 * @description  function logs out a user
 * @param {Null}
 * @return {Promise<{result: AxiosResponse<Object>}>} user object from backend
 */
export const handleUserLogout =
  (isForced?: boolean) =>
    (dispatch: TDispatch): Promise<boolean | void> => {
      dispatch(setLoading(true))
      return UserService.signOut()
        .then(async () => {
          await persistor.purge()

          setAccessToken()

          batch(() => {
            dispatch(handleSetUser({}))
            dispatch({ type: actions.LOG_OUT })
          })

          return true
        })
        .catch((error) => {
          return error
        })
        .finally(() => {
          dispatch(handleSetUser({}))
          localStorage.clear()
          if (isForced) {
            localStorage.setItem('forced-logout', 'true')
          }
          dispatch({ type: actions.LOG_OUT })
          dispatch(setLoading(false))
        })
    }
