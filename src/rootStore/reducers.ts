import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import polls from '@/Polls/store';

const reducers = {
  [polls.SCOPENAME]: polls.reducer,
};

const createRootReducer = (history: any) => (state: any, action: any) => {
  return combineReducers({
    router: connectRouter(history),
    ...reducers
  })(state, action);
};

export default createRootReducer;
