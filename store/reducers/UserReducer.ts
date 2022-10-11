import { AnyAction } from 'redux';
import update from 'immutability-helper'
import actions from '../../store/action-types/user';
import businessActions from '../../store/action-types/business';
import { UserProfile } from '../../interfaces/http';

const initialState = {
  data: {
    profile: {}, user: {}, wallet: [{}], business: {}, isTempUser: {},
  } as UserProfile,
  isAuthenticated: false
};

const removeTeamMember = (state: typeof initialState, id: string | number) => {
  const memberIndex = state.data.business.team_members.findIndex(member => member.profile?.id === id)
  return update(state, { data: { business: { team_members: { $splice: [[memberIndex, 1]] } } } }
  )
}

type UserReducerType = typeof initialState;

export default (state = initialState, { type, payload }: AnyAction): UserReducerType => {
  switch (type) {
    case actions.SET_USER:
    case actions.LOG_IN:
      return {
        ...state,
        data: { ...payload, isTempUser: null },
        isAuthenticated: true
      };

    case actions.SET_TEMP_USER:
      return {
        ...state,
        data: { ...state.data, isTempUser: payload },
        isAuthenticated: state?.data?.profile?.first_name !== null
      };

    case actions.UPDATE_USER_PROFILE:
      return {
        ...state,
        data: { ...state.data, profile: { ...state.data, ...payload } },
        isAuthenticated: true
      };
    case businessActions.GET_TEAMS:
      return {
        ...state,
        data: { ...state.data, business: { ...state.data.business, team_members: payload.team_members } }
      }
    case businessActions.REMOVE_TEAM_MEMBER:
      return removeTeamMember(state, payload)
    case actions.TOGGLE_LIVE_MODE:
      return {
        ...state,
        data: { ...state.data, profile: { ...state.data.profile, test_mode: payload } }
      }
    case actions.GET_WALLETS:
      return {
        ...state,
        data: { ...state.data, wallet: payload }
      }

    case actions.LOG_OUT:
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false
      };


    default:
      return state;
  }
};
