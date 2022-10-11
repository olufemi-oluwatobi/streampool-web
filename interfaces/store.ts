/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from 'redux-thunk';
import store from '../store';

export type RootState = ReturnType<typeof store.getState>;

export type TDispatch = ThunkDispatch<RootState, void, any>;

export type ThunkActionResponse = Promise<void | Record<string, unknown>> | undefined;
