import { 
  AlertActionTypes, 
  CLOSE_ALERT, 
  SHOW_ERROR_ALERT, 
  SHOW_SUCCESS_ALERT, 
} from './actions';

export interface AlertState {
  type: 'success' | 'error' | null;
  message: string | null;
  isOpen: boolean;
}

const initialState: AlertState = {
  type: null,
  message: null,
  isOpen: false
};

export const alertReducer = (state = initialState, action: AlertActionTypes): AlertState => {
  switch (action.type) {
    case SHOW_SUCCESS_ALERT:
      return {
        type: 'success',
        message: action.payload.message,
        isOpen: true
      };
    case SHOW_ERROR_ALERT:
      return {
        type: 'error',
        message: action.payload.message,
        isOpen: true
      };
    case CLOSE_ALERT:
      return initialState;
    default:
      return state;
  }
};
