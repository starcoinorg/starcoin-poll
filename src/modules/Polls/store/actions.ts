import * as types from './constants';

export function getPoll(payload: any) {
  return {
    type: types.GET_POLL,
    payload
  };
}

export function setPoll(payload: any) {
  return {
    type: types.SET_POLL,
    payload
  };
}

export function getPollByHeight(payload: any) {
  return {
    type: types.GET_POLL_BY_HEIGHT,
    payload
  };
}

export function getPollList(payload: any, callback?: any) {
  return {
    type: types.GET_POLL_LIST,
    payload,
    callback
  };
}

export function setPollList(payload: any) {
  return {
    type: types.SET_POLL_LIST,
    payload
  };
}
