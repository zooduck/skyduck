import { StateAPotamus } from '../state/stateapotamus';
import { setBasicContentOnError } from './set-basic-content-on-error';
import { setLoaderError } from './set-loader-error';

export const revertContentOnError = function revertContentOnError() {
    const { hasLoaded } = StateAPotamus.getState();

    if (hasLoaded) {

        setLoaderError.call(this);

        StateAPotamus.dispatch('SET_LOADING', {
            isLoading: true,
        });

        return;
    }

    setBasicContentOnError.call(this);
};
