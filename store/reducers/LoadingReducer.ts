import { AnyAction } from 'redux';

const initialState = { loading: false };

type LoadingReducerState = typeof initialState;

export default (state = initialState, { type, payload }: AnyAction): LoadingReducerState => {
  switch (type) {
    case 'LOADING_PAGE':
      return {
        ...state,
        loading: payload,
      };

    default:
      return state;
  }
};
