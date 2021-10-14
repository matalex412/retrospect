import {combineReducers} from 'redux';
import {UPDATE_LOGS} from './actions';

const logsReducer = (
  state = {
    successes: [],
    failures: [],
    goals: [],
    timeframe: 'day',
  },
  action,
) => {
  switch (action.type) {
    case UPDATE_LOGS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer = combineReducers({
  logs: logsReducer,
});
