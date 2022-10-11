/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */

import { AnyAction, combineReducers } from 'redux';
import { MigrationManifest } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import User from './UserReducer'
import Loading from './LoadingReducer'
import Page from './PageReducer';
import Transactions from './transactionsReducer'
import GiftCards from './giftCardReducer'
import Carts from './cartReducer'

import userTypes from '../action-types/user';

const tempReducer = combineReducers({
    User,
    Loading,
    Page,
    GiftCards,
    Transactions,
    Carts
})

const rootReducer = (state: any, action: AnyAction): RootReducer => {
    if (action.type === userTypes.LOG_OUT) {
        storage.removeItem('persist:root');
        state = { GiftCards: state.GiftCards }
    }
    return tempReducer(state, action);
};

export type RootReducer = ReturnType<typeof tempReducer>

export const migrations: MigrationManifest = {
    0: (state: any): any => {
        return { ...state }
    },
    1: (state: any): any => {
        return { ...state, Page: { pageTitle: 'Digift NG', redirectUrl: '' } }
    },
    2: (state: any): any => {
        return {
            ...state,
            Page: { pageTitle: 'Digift NG', redirectUrl: '' },
            User: {
                ...state.user,
                data: {
                    profile: {},
                    user: {},
                    wallet: []
                }
            }
        }
    }
}

export default rootReducer;
