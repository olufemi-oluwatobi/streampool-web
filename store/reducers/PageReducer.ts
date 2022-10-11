import { AnyAction } from 'redux';
import pageActions from '../action-types/page';

const initialState = {
  pageTitle: 'Digift NG', redirectUrl: '', displayPurchaseModal: false,
  pagination: {
    current_page: 1,
    first_page: true,
    last_page: false,
    next_page: 2,
    page_count: 6,
    per_page: 10,
    prev_page: null,
    total: 144,
  },
}

type PageReducerType = typeof initialState;

const pageReducer = (state = initialState, action: AnyAction): PageReducerType => {
  switch (action.type) {
    case pageActions.SET_PAGE_TITLE:
      document.title = `${action.payload} | Digift NG`;

      return { ...state, pageTitle: action.payload };
    case pageActions.SET_PURCHASE_WALL:
      return { ...state, displayPurchaseModal: action.payload };
    case pageActions.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    default:
      return state;
  }
}

export default pageReducer;
