import { StateAPotamus } from '../state/stateapotamus';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { SkyduckElements } from '../services/skyduck-elements';
// eslint-disable-next-line no-unused-vars
import { WeatherElements } from '../interfaces/index';
import { onFirstLoad } from './on-first-load';
import { setLoaderError } from './set-loader-error';

export const setBasicContentOnError = async function setBasicContentOnError() {
    const { error, hasLoaded } = StateAPotamus.getState();

    if (hasLoaded) {
        return;
    }

    await onFirstLoad.call(this);

    setLoaderError.call(this);

    const weatherElements: WeatherElements = new SkyduckElements(generalEventHandlers.call(this));

    const {
        headerPlaceholder,
        header,
        forecastHeader,
        clubList,
    } = weatherElements;

    this.shadowRoot.appendChild(headerPlaceholder);
    this.shadowRoot.appendChild(header);
    this.shadowRoot.appendChild(forecastHeader);
    this.shadowRoot.appendChild(clubList);

    StateAPotamus.dispatch('HAS_LOADED', {
        hasLoaded: true,
    });

    if (error) {
        return;
    }

    StateAPotamus.dispatch('SET_READY');
    StateAPotamus.dispatch('SET_LOADED', {
        isLoading: false,
    });
};