import { StateAPotamus } from '../state/stateapotamus';
import { getImages } from './get-images';
import { onFirstLoad } from './on-first-load';
import { clearContent } from './clear-content';
// eslint-disable-next-line no-unused-vars
import { WeatherElements } from '../interfaces/index';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { wait } from './wait/wait';
import { SkyduckElements } from '../services/skyduck-elements';
import { setLoaderError } from './set-loader-error';

export const setContent = async function setContent() {
    const { error, hasLoaded, imagesReady } = StateAPotamus.getState();
    const SKYDUCK_INTERVAL_LOADER_MINIMUM_SCREEN_TIME_MILLIS = 2000;
    const SKYDUCK_INTERVAL_LOADER_READY_TRANSITION_MILLIS = 500;
    const SKYDUCK_INTERVAL_LOADER_REMOVE_TRANSITION_MILLIS = 500;
    const DOM_RENDER_TIME_MILLIS = 250;

    if (!hasLoaded) {
        await onFirstLoad.call(this);
    }

    if (error) {
        setLoaderError.call(this);

        return;
    }

    if (!imagesReady) {
        await getImages();
    }

    if (hasLoaded) {
        await wait(SKYDUCK_INTERVAL_LOADER_MINIMUM_SCREEN_TIME_MILLIS);

        StateAPotamus.dispatch('SET_INTERVAL_LOADER_READY');

        await wait(SKYDUCK_INTERVAL_LOADER_READY_TRANSITION_MILLIS);

        clearContent.call(this);
    }

    const weatherElements: WeatherElements = new SkyduckElements(generalEventHandlers.call(this));

    const {
        forecast,
        forecastExtended,
        lastUpdatedInfo,
    } = weatherElements;

    if (!hasLoaded) {
        // Render once only
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
    }

    this.shadowRoot.appendChild(forecast);
    this.shadowRoot.appendChild(forecastExtended);
    this.shadowRoot.appendChild(lastUpdatedInfo);

    if (!hasLoaded) {
        StateAPotamus.dispatch('HAS_LOADED', {
            hasLoaded: true,
        });
    }

    // Give content a chance to render before removing loader
    // ==========================================================
    // @NOTE: This is necessary to prevent any stuttering effect
    // from happening with the animation that removes the loader
    // ==========================================================
    await wait(DOM_RENDER_TIME_MILLIS);

    StateAPotamus.dispatch('SET_READY');

    if (hasLoaded) {
        StateAPotamus.dispatch('SET_INTERVAL_LOADER_LOADED');

        await wait(SKYDUCK_INTERVAL_LOADER_REMOVE_TRANSITION_MILLIS);
    }

    StateAPotamus.dispatch('SET_LOADED', {
        isLoading: false,
    });
};
