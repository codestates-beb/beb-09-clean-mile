export const SHOW_SUCCESS_ALERT = 'SHOW_SUCCESS_ALERT';
export const SHOW_ERROR_ALERT = 'SHOW_ERROR_ALERT';
export const CLOSE_ALERT = 'CLOSE_ALERT';

interface ShowSuccessAlertAction {
  type: typeof SHOW_SUCCESS_ALERT;
  payload: { message: string };
}

interface ShowErrorAlertAction {
  type: typeof SHOW_ERROR_ALERT;
  payload: { message: string };
}

interface CloseAlertAction {
  type: typeof CLOSE_ALERT;
}

export type AlertActionTypes =
  | ShowSuccessAlertAction
  | ShowErrorAlertAction
  | CloseAlertAction

export const showSuccessAlert = (message: string): AlertActionTypes => ({
  type: SHOW_SUCCESS_ALERT,
  payload: { message },
});

export const showErrorAlert = (message: string): AlertActionTypes => ({
  type: SHOW_ERROR_ALERT,
  payload: { message },
});

export const closeAlert = (): AlertActionTypes => ({
  type: CLOSE_ALERT,
});
