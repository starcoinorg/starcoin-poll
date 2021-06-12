import { createSelector } from 'reselect';
import * as types from './constants';

const selector = (state: any) => state[types.SCOPENAME];

export const pollSelector = createSelector(
  selector,
  state => state.poll
);

