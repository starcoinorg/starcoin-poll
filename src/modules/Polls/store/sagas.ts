import { call, put, takeLatest, delay, fork } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

export function* getPoll(action: ReturnType<typeof actions.getPoll>) {
  try {
    const res = yield call(withLoading, api.getPoll, action.type, action.payload);
    yield put(actions.setPoll(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetPoll() {
  yield takeLatest(types.GET_POLL, getPoll)
}


export function* getPollByHeight(action: ReturnType<typeof actions.getPoll>) {
  try {
    const res = yield call(withLoading, api.getPollByHeight, action.type, action.payload);
    yield put(actions.setPoll(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetPollByHeight() {
  yield takeLatest(types.GET_POLL_BY_HEIGHT, getPollByHeight)
}

export function* getPollList(action: ReturnType<typeof actions.getPollList>) {
  try {
    const res = yield call(withLoading, api.getPollList, action.type, action.payload);
    yield put(actions.setPollList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setPollList([]));
    }
  }
}

function* watchGetPollList() {
  yield takeLatest(types.GET_POLL_LIST, getPollList)
}

const sagas = [
  watchGetPoll,
  watchGetPollByHeight,
  watchGetPollList
];

export default sagas;