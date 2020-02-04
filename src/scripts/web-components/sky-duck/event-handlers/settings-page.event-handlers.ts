// eslint-disable-next-line no-unused-vars
import { SettingsPageEventHandlers } from '../interfaces/index';
import { StateAPotamus } from '../state/stateapotamus';
import { subSettings } from '../utils/sub-settings';

export const settingsPageEventHandlers = function settingsPageEventHandlers(): SettingsPageEventHandlers {
    const getForecastForCurrentLocationHandler = (): void => {
        try {
            this.location = StateAPotamus.getState().userLocation.name;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

    const onLocationChangeHandler = (e: CustomEvent): void => {
        const { value: location } = e.detail;

        this.location = location;
    };

    const toggleActiveCarouselHandler = (): void => {
        let activeCarousel: string;
        let headerTitle: string;
        let headerSubTitle: string;

        if (StateAPotamus.getState().settings.activeCarousel === 'forecast') {
            activeCarousel = 'club-list';
            headerTitle = StateAPotamus.getState().currentClubListCountry;
            headerSubTitle = 'Dropzones';
        } else {
            activeCarousel = 'forecast';
            headerTitle = StateAPotamus.getState().locationDetails.name;
            headerSubTitle = StateAPotamus.getState().locationDetails.address;
        }

        StateAPotamus.dispatch('TOGGLE_ACTIVE_CAROUSEL', {
            headerSubTitle,
            headerTitle,
            settings: {
                ...StateAPotamus.getState().settings,
                activeCarousel,
            }
        });
    };

    const toggleForecastDisplayModeHandler = (): void => {
        const forecastDisplayMode = StateAPotamus.getState().settings.forecastDisplayMode === 'extended'
            ? 'standard'
            : 'extended';

        StateAPotamus.dispatch('TOGGLE_FORECAST_DISPLAY_MODE', {
            settings: {
                ...StateAPotamus.getState().settings,
                forecastDisplayMode,
            }
        });
    };

    const toggleLocationSettingsHandler = (): void => {
        StateAPotamus.dispatch('TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS', {
            currentSubSettings: subSettings.LOCATION_SETTINGS,
        });
    };

    return {
        getForecastForCurrentLocationHandler: getForecastForCurrentLocationHandler.bind(this),
        onLocationChangeHandler: onLocationChangeHandler.bind(this),
        toggleActiveCarouselHandler: toggleActiveCarouselHandler.bind(this),
        toggleForecastDisplayModeHandler: toggleForecastDisplayModeHandler.bind(this),
        toggleLocationSettingsHandler: toggleLocationSettingsHandler.bind(this),
    };
};