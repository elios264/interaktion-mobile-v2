import _ from 'lodash';
import i18n from 'i18n-js';
import { showDialog, showConfirmDialog } from 'controls/utils';

export { showDialog, showConfirmDialog };

export const handleError = (fn, errorMessage = '', { rethrow = false, silent = false } = {}) => async (dispatch, ...rest) => {
  try {
    return await fn(dispatch, ...rest);
  } catch (err) {
    errorMessage = _.isFunction(errorMessage) ? errorMessage(dispatch, ...rest) : errorMessage;
    const exceptionMessage = _.isObject(err)
      ? err.message || err.responseText || JSON.stringify(err)
      : i18n.t('error.unknown', { error: _.toString(err) });

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    if (!silent) {
      showDialog(errorMessage, exceptionMessage);
    }

    if (rethrow) {
      throw new Error(errorMessage ? `${errorMessage}\n${exceptionMessage}` : exceptionMessage);
    }

    return undefined;
  }
};
