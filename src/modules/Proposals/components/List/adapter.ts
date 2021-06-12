import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Proposals/store';
import * as types from '@/Proposals/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_PROPOSAL_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    proposalList: current.proposalList,
    isLoadingMore: current.isLoadingMore,
    loading
  })
);

export default connect(selector, {
  getProposalList: actions.getProposalList
})(Index) as any;