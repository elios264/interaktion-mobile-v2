import { LoadingButton } from 'controls/loadingButton';
import { makeAwaitable } from './makeAwaitable';

export { makeAwaitable };
export const AwaitableButton = makeAwaitable({
  event: 'onPress',
  props: {
    disabled: true,
    loading: true,
  },
})(LoadingButton);
