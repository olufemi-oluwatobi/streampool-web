/* eslint-disable  @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware, compose, AnyAction } from 'redux';
import { persistReducer, persistStore, createMigrate } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';

import rootReducer, { migrations, RootReducer } from './reducers';

const persistConfig = {
    key: 'root',
    storage,
    version: 2,
    stateReconciler: autoMergeLevel2,
    migrate: createMigrate(migrations, { debug: true }),
}

const persistedReducer = persistReducer<RootReducer, AnyAction>(persistConfig, rootReducer)

const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

export const persistor = persistStore(store);

export default store;
