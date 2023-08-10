import { combineReducers } from 'redux';
import { alertReducer } from './reducer';

const rootReducer = combineReducers({
  alert: alertReducer,
});

export default rootReducer;
