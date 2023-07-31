import { SET_LOGGED_IN } from './ActionTypes';

export const setLoggedIn = (isLoggedIn) => {
  return {
      type: SET_LOGGED_IN,
      payload: isLoggedIn
  }
};

const initialState = {
  isLoggedIn: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
      case SET_LOGGED_IN:
          return {
              ...state,
              isLoggedIn: action.payload
          };
      default:
          return state;
  }
};

export default reducer;