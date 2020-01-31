import { StateAPotamus } from '../state/stateapotamus';
import { getImages } from './get-images';
import { onFirstLoad } from './on-first-load';
import { clearContent } from './clear-content';
import { setLoaderInfoDisplay } from './set-loader-info-display';
// eslint-disable-next-line no-unused-vars
import { WeatherElements } from '../interfaces/index';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { wait } from './wait/wait';
import { SkyduckElements } from '../services/skyduck-elements';
import { getLoaderInfoElements } from './get-loader-info-elements';

export const setContent = async function setContent() {
    const { hasLoaded, imagesReady } = StateAPotamus.getState();

    if (!hasLoaded) {
        await onFirstLoad.call(this);
    }

    if (!imagesReady) {
        await getImages();
    }

    if (hasLoaded) {
        clearContent.call(this);

        const loaderInfoElements = getLoaderInfoElements.call(this);

        try {
            await setLoaderInfoDisplay(
                StateAPotamus.getState().forecast,
                loaderInfoElements
            );
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
        }
    }

    const weatherElements: WeatherElements = new SkyduckElements(generalEventHandlers.call(this));

    const {
        forecast,
        forecastExtended,
        footer,
    } = weatherElements;

    StateAPotamus.dispatch('SET_READY');

    if (!hasLoaded) {
        // Render once only
        const { headerPlaceholder, header, clubList } = weatherElements;

        this.shadowRoot.appendChild(headerPlaceholder);
        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(clubList);
    }

    this.shadowRoot.appendChild(forecast);
    this.shadowRoot.appendChild(forecastExtended);
    this.shadowRoot.appendChild(footer);

    if (!hasLoaded) {
        StateAPotamus.dispatch('HAS_LOADED', {
            hasLoaded: true,
        });
    }

    await wait(250); // Give content a chance to render before removing loader

    StateAPotamus.dispatch('SET_LOADED', {
        isLoading: false,
    });
};
