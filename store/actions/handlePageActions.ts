import { AnyAction } from 'redux';
import pageActions from '../action-types/page';

export const setPageTitle = (title: string): AnyAction => 
  ({ type: pageActions.SET_PAGE_TITLE, payload: title })