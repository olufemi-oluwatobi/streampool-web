/* eslint-disable */

import 'react-redux';

import { RootState } from './store';

declare module 'react-redux' {
    export interface DefaultRootState extends RootState { }
}