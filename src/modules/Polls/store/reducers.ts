import * as types from './constants';

const initState = {
  poll: null,
  pollList: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_POLL: {
      return { ...state, poll: action.payload };
    }
    case types.SET_POLL_LIST: {
      return { ...state, pollList: action.payload };
    }
    case types.GET_POLL_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_POLL_LIST_SUCCESS:
    case types.GET_POLL_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    default:
      return state;
  }
}