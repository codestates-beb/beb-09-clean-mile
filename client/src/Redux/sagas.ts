import { takeEvery, put, all, AllEffect, ForkEffect } from 'redux-saga/effects';
import Swal from 'sweetalert2';
import { 
  AlertActionTypes, 
  CLOSE_ALERT, 
  SHOW_ERROR_ALERT, 
  SHOW_SUCCESS_ALERT, 
  showSuccessAlert, 
  showErrorAlert
} from './actions';

/**
 * 주어진 액션으로부터 얻은 메시지를 토스트 알림으로 보여줌
 * 
 * @param {AlertActionTypes} action - 알림을 표시하기 위한 액션 타입
 */
function* showAlert(action: AlertActionTypes) {
  if ('payload' in action) {
    const { type, payload: { message } } = action;

    let icon: 'success' | 'error' = 'success';
    let title: string = 'Success';

    switch (type) {
      case SHOW_SUCCESS_ALERT:
        icon = 'success';
        break;
      case SHOW_ERROR_ALERT:
        icon = 'error';
        title = 'Error';
        break;
      default:
        break;
    }

    yield Swal.fire({
      title: title,
      text: message,
      icon: icon,
      toast: true, 
      position: 'top-end', 
      showConfirmButton: false,
      timer: 3000, 
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }

  // 알림이 표시된 후 상태에서 알림을 닫음
  yield put({ type: CLOSE_ALERT });
}

/**
 * 알림 관련 액션을 모니터링하고 해당 액션 발생 시 showAlert 함수를 실행
 */
function* watchAlerts(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([
    takeEvery([
      SHOW_SUCCESS_ALERT, 
      SHOW_ERROR_ALERT, 
    ], showAlert)
  ]);
}

export default watchAlerts;
