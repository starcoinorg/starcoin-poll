import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-ignore
import createLoadingSelector from '@/rootStore/loading/selector';
import store from '@/Polls/store';
import * as types from '@/Polls/store/constants';
import Index from './index';

const { selector: currentSelector, actions } = store;

const loadingSelector = createLoadingSelector([types.GET_POLL_LIST]);

const selector = createSelector(
  currentSelector,
  loadingSelector,
  (current, loading) => ({
    pollList: current.pollList,
    isLoadingMore: current.isLoadingMore,
    loading
  })
);

export default connect(selector, {
  getPollList: actions.getPollList
})(Index) as any;