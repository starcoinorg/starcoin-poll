import { call, put, takeLatest, delay, fork } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

export function* getProposal(action: ReturnType<typeof actions.getProposal>) {
  try {
    const res = yield call(withLoading, api.getProposal, action.type, action.payload);
    yield put(actions.setProposal(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetProposal() {
  yield takeLatest(types.GET_PROPOSAL, getProposal)
}


export function* getProposalByHeight(action: ReturnType<typeof actions.getProposal>) {
  try {
    const res = yield call(withLoading, api.getProposalByHeight, action.type, action.payload);
    yield put(actions.setProposal(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetProposalByHeight() {
  yield takeLatest(types.GET_PROPOSAL_BY_HEIGHT, getProposalByHeight)
}

export function* getProposalList(action: ReturnType<typeof actions.getProposalList>) {
  try {
    const res = yield call(withLoading, api.getProposalList, action.type, action.payload);
    yield put(actions.setProposalList(res));
    if (action.callback) {
      yield call(action.callback);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setProposalList([]));
    }
  }
}

function* watchGetProposalList() {
  yield takeLatest(types.GET_PROPOSAL_LIST, getProposalList)
}

const sagas = [
  watchGetProposal,
  watchGetProposalByHeight,
  watchGetProposalList
];

export default sagas;