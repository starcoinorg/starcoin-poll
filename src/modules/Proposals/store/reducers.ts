import * as types from './constants';

const initState = {
  proposal: null,
  proposalList: null,
  isLoadingMore: false,
};

export default function reducers(state: any = initState, action: any) {
  switch (action.type) {
    case types.SET_PROPOSAL: {
      return { ...state, proposal: action.payload };
    }
    case types.SET_PROPOSAL_LIST: {
      return { ...state, proposalList: action.payload };
    }
    case types.GET_PROPOSAL_LIST_REQUEST: {
      return { ...state, isLoadingMore: true };
    }
    case types.GET_PROPOSAL_LIST_SUCCESS:
    case types.GET_PROPOSAL_LIST_FAILURE: {
      return { ...state, isLoadingMore: false };
    }
    default:
      return state;
  }
}