import { combineReducers } from 'redux';
import { alertReducer } from './reducer'; // 실제 경로로 바꿔주세요.

const rootReducer = combineReducers({
  alert: alertReducer,
  // 여기에 추가적인 리듀서를 추가할 수 있습니다.
});

export default rootReducer;
