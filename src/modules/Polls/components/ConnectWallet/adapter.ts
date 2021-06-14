import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Polls/store';
import * as types from '@/Polls/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_POLL, types.GET_POLL_VOTES, types.GET_WALLECT_ACCOUNTS]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    poll: current.poll,
    accounts: current.accounts,
    loading
  })
);

export default connect(selector, {
  getPoll: actions.getPoll,
  getPollVotes: actions.getPollVotes,
  connectWallet: actions.connectWallet,
  setWalletAccounts: actions.setWalletAccounts,
})(Index) as any;