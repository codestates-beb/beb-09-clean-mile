import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { SHOW_ALERT, HIDE_ALERT } from './ActionTypes';
import { Alert, AlertState } from '../Components/Interfaces';

interface ShowAlertAction {
  type: typeof SHOW_ALERT;
  payload: Alert;
}

interface HideAlertAction {
  type: typeof HIDE_ALERT;
}

export type AlertActionTypes = ShowAlertAction | HideAlertAction;

const initialState: AlertState = {
  visible: false,
  alert: {
    title: '',
    text: '',
    icon: undefined,
    confirmButtonText: '',
    confirmButtonColor: '',
  },
};

/**
 * 알림 표시 액션 생성자.
 *
 * @param {Object} alert - SweetAlert2 설정.
 * @returns {Object} 액션 객체.
 */
export const showAlert = (alert: Alert): ShowAlertAction => ({
  type: SHOW_ALERT,
  payload: alert,
});

/**
 * 알림 숨기기 액션 생성자.
 *
 * @returns {Object} 액션 객체.
 */
export const hideAlert = (): HideAlertAction => ({
  type: HIDE_ALERT,
});

/**
 * alert 리듀서. 이전 상태와 액션을 인자로 받아 새 상태를 반환.
 *
 * @param {Object} [state=initialState] - 이전 상태.
 * @param {Object} action - 액션 객체.
 * @returns {Object} 새 상태.
 */
export const alertReducer = (state = initialState, action: AlertActionTypes) => {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        alert: action.payload as Alert,

      };
    case HIDE_ALERT:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};

/**
 * Redux 스토어는 애플리케이션의 상태를 저장하는 객체, createStore 함수를 사용하여 생성
 * DevTools 확장 프로그램은 개발 도구에서 Redux 상태 및 액션을 시각적으로 추적하는 데 사용.
 *
 * @type {Object}
 */
export const store = createStore(alertReducer, composeWithDevTools());
