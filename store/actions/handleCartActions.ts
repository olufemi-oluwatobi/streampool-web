/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AnyAction } from "redux";

import { TDispatch } from "../../interfaces/store";
import { handleCatchError } from "../../utils";
import {
    CartPayload,
    UserProfile,
    CartPaymentPayload,
    CartTransactionPayload,
} from "../../interfaces/http";
import { CartService } from "../../services";

import { CartItemUpdatePayload } from "../../interfaces/http";
import actions, { ActionTypes } from "../action-types/cart";
import { handleSetLoader as setLoading } from "./handlePageLoadingAction";
import { handleFetchUserDetails } from "./handleUserActions";

export const setBusinessAction = (
    payload: any,
    action: ActionTypes
): AnyAction => ({
    type: actions[action],
    payload,
});

export const handleGetCart =
    (obj = {}) =>
        (dispatch: TDispatch) => {
            dispatch(setLoading(true));

            return CartService.getCart()
                .then((res) => {
                    dispatch(setBusinessAction(res.data.data, ActionTypes.GET_CART));
                })
                .catch(handleCatchError)
                .finally(() => {
                    dispatch(setLoading(false));
                });
        };

export const handlePostCart =
    (id: string, data: CartPayload) => (dispatch: TDispatch) => {
        dispatch(setLoading(true));

        return CartService.postCart(id, data)
            .then((res) => {
                // Raise this with val
                dispatch(handleGetCart());
            })
            .catch(handleCatchError)
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

export const handleUpdateCart =
    (cartId: string, cartItemId: string | number, data: CartItemUpdatePayload) =>
        (dispatch: TDispatch) => {
            return CartService.updateCartItem(
                cartId,
                cartItemId as unknown as string,
                data
            )
                .then((res) => {
                    dispatch(handleGetCart());
                })
                .catch(handleCatchError)
                .finally(() => {
                    dispatch(setLoading(false));
                });
        };

export const completeTransactionPayment =
    (user: UserProfile, data: CartTransactionPayload, cartId: string) =>
        async (dispatch: TDispatch) => {
            dispatch(setLoading(true));
            const res = await CartService.generateCartReference(data);

            const payload: CartPaymentPayload = {
                address: "Address",
                from: user.profile?.phone_number.replace("+234", "0"),
                sender: "DigiftNg",
                msg: "Thank you for doing business with us",
                cart: cartId,
                action: "order",
                postal: "1001020",
                reference: res.data.data.reference,
            };
            return CartService.sendTransaction(payload)
                .then((res) => {
                    dispatch(handleGetCart());
                    dispatch(handleFetchUserDetails());
                })
                .catch(handleCatchError)
                .finally(() => {
                    dispatch(setLoading(false));
                });
        };

export const handleDeleteCart =
    (cartId: string, cartItemId: string | number) => (dispatch: TDispatch) => {
        dispatch(setLoading(true));

        return CartService.deleteCartItem(cartId, cartItemId)
            .then((res) => {
                dispatch(handleGetCart());
            })
            .catch(handleCatchError)
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
