/* eslint-disable */
import { AxiosError } from 'axios';
import { NotifyService } from '../../services';
import { ApiResponse } from '../../interfaces'

/**
 * @name handleThenSuccess
 * @description  function handles success case axios calls
 * @param {Object} res
 * @param {Function} callback
 * @return {Object} returns the server object
 */
export const handleThenSuccess = (result: any, callback: Function) => {
  if (typeof callback === 'function' && result.data !== null && result.data !== undefined) callback(result);

  return result
}

/**
 * @name handleCatchError
 * @description  function handles error case axios calls
 * @param {Object} err
 * @return {Object} returns the error object
 */
export const handleCatchError = (err: Error & AxiosError<ApiResponse>) => {
  const errorBag = [];

  // Check for internal error messages and push to error bag
  if (err.response?.data) {
    const data = err.response.data;

    if (data.message) errorBag.push(data.message);
    if (data.error) errorBag.push(data.error)

    if (data.errMessage) {
      const message = typeof data.errMessage === 'string'
        ? data.errMessage
        : data.errMessage.message;

      errorBag.push(message);
    }
  }

  // Toast all the errors
  errorBag.forEach(error => NotifyService.setTitle('Error').setMessage(error).error());
}

/**
 *
 * @name ResolveAll
 * @description  function handles axios calls
 * @param {Array} [action=[]]
 * @param {String} [message=null]
 * @param {*} [initial=null]
 * @returns {Object}
 */
export const ResolveAll = async (action = [], message = null, initial = undefined) => {
  // if (message) {
  //   // swal('Done!', message, 'success');
  //   return Promise.all(action)
  // }
  // if (typeof initial === 'function') {
  //   console.log('object fired!')
  //   // if (message) swal('Done!', message, 'success');
  //   // return Promise.all(action)
  //   //   .then((results) => {
  //   //     // Promise.all(action)
  //   //     if (typeof initial() === 'object') {
  //   //       return { ...initial(), results };
  //   //     }
  //   //     initial();
  //   //     return results;
  //   //   })
  //   //   .catch(handleCatchError);
  // }
  // if (typeof initial === 'object') {
  //   const value = await initial
  //   // if (message) swal('Done!', message, 'success');
  //   return new Promise((resolve, reject) => {
  //     if (handleThenSuccess({ data: value }, null).status !== 200) {
  //       return reject(handleThenSuccess(initial, null))
  //     }
  //     Promise.all(action)
  //     return resolve(handleThenSuccess({ data: value }, null))
  //   })
  // }
  // return Promise.all(action)
}
