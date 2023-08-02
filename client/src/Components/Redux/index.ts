import { SET_LOGGED_IN } from './ActionTypes';

export const setLoggedIn = (isLoggedIn: boolean) => {
  return {
      type: SET_LOGGED_IN,
      payload: isLoggedIn
  }
};

const initialState = {
  isLoggedIn: false
};

interface Action {
  type: string;
  payload: boolean;
}

const reducer = (state = initialState, action: Action) => {
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