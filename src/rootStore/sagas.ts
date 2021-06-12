import { all, fork } from 'redux-saga/effects';
import proposals from '@/Proposals/store';
import blocks from '@/Blocks/store';
import transactions from '@/Transactions/store';
import search from '@/Search/store';
import routerSaga from './router/sagas';

const sagas = [
  ...proposals.sagas,
  ...blocks.sagas,
  ...transactions.sagas,
  ...search.sagas,
  ...routerSaga
];

function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
};

export default rootSaga;