import { AnyAction } from "redux";
import update from 'immutability-helper';
import actions from "../../store/action-types/cart";
import { CartReducer, CartItem } from "../../interfaces/http";

type CartReducerType = typeof initialState;

const initialState: CartReducer = {
    data: {
        cartItems: [],
        id: "",
    },
};


const removeFromCart = (state = initialState, cartId: string | number) => {
    const index = state.data.cartItems.findIndex(item => item.id === cartId)
    return update(state, {
        data: {
            cartItems: {
                $splice: [[index]]
            }
        }
    }
    )
}

const updateCart = (state = initialState, cartItemId: string | number, data = {}) => {
    const index = state.data.cartItems.findIndex(item => item.id === cartItemId)
    return update(state, {
        data: {
            cartItems: {
                [index]: {
                    $merge: data
                }
            }
        }
    }
    )
}


export default (
    state = initialState,
    { type, payload }: AnyAction
): CartReducerType => {
    switch (type) {
        case actions.GET_CART:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload.cart,
                    cartItems: payload.cart.cart_items,
                },
            };
        case actions.ADD_CART_ITEM:
            return {
                ...state,
                data: {
                    ...state.data,
                    cartItems: [...state.data.cartItems, payload],
                },
            };
        case actions.UPDATE_CARD_ITEM:
            return updateCart(state, payload.cartItemId, payload.data)
        case actions.DELETE_CART_ITEM:
            return removeFromCart(state, payload)
        default:
            return state;
    }
};
