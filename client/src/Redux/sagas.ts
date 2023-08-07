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

function* showAlert(action: AlertActionTypes) {
  if ('payload' in action) {
    const { type, payload: { message } } = action;

    // 'icon' and 'title' will change depending on the type of alert
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
      confirmButtonText: 'OK',
      confirmButtonColor: '#6BCB77'
    });
  }

  // Close the alert in the state after it has been shown
  yield put({ type: CLOSE_ALERT });
}

function* watchAlerts(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([
    takeEvery([
      SHOW_SUCCESS_ALERT, 
      SHOW_ERROR_ALERT, 
    ], showAlert)
  ]);
}

export default watchAlerts;
