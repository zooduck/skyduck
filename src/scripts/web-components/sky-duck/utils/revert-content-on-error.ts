import { StateAPotamus } from '../state/stateapotamus';
import { setBasicContentOnError } from './set-basic-content-on-error';

export const revertContentOnError = function revertContentOnError() {
    const { error, hasLoaded } = StateAPotamus.getState();

    if (hasLoaded) {

        StateAPotamus.dispatch('SET_LOADING', {
            isLoading: true,
        });

        return;
    }

    setBasicContentOnError.call(this);

    if (!error) {
        return;
    }

    console.error(error); // eslint-disable-line no-console
};
