import * as types from './constants';

export function getProposal(payload: any) {
  return {
    type: types.GET_PROPOSAL,
    payload
  };
}

export function setProposal(payload: any) {
  return {
    type: types.SET_PROPOSAL,
    payload
  };
}

export function getProposalByHeight(payload: any) {
  return {
    type: types.GET_PROPOSAL_BY_HEIGHT,
    payload
  };
}

export function getProposalList(payload: any, callback?: any) {
  return {
    type: types.GET_PROPOSAL_LIST,
    payload,
    callback
  };
}

export function setProposalList(payload: any) {
  return {
    type: types.SET_PROPOSAL_LIST,
    payload
  };
}
