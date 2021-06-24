import { all, fork } from 'redux-saga/effects';
import polls from '@/Polls/store';
import routerSaga from './router/sagas';

const sagas = [
  ...polls.sagas,
  ...routerSaga
];

function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
};

export default rootSaga;