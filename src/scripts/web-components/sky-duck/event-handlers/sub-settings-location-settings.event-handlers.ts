import { geocodeLookup } from '../fetch/geocode-lookup.fetch';
import { StateAPotamus } from '../state/stateapotamus';
import { revertContentOnError } from '../utils/revert-content-on-error';
// eslint-disable-next-line no-unused-vars
import { SubSettingsLocationSettingsEventHandlers } from '../interfaces/index';

export const subSettingsLocationSettingsEventHandlers = function subSettingsLocationSettingsEventHandlers(): SubSettingsLocationSettingsEventHandlers {
    const setCurrentLocationHandler = async (e: CustomEvent): Promise<void> => {
        const { value: requestedLocation } = e.detail;

        try {
            const geocodeData = await geocodeLookup(requestedLocation);

            StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                userLocation: geocodeData,
            });
        } catch (err) {
            StateAPotamus.dispatch('ERROR', {
                error: err,
            });

            revertContentOnError.call(this);
        }
    };

    const toggleUseGPSForCurrentLocationHandler = (): void => {
        StateAPotamus.dispatch('TOGGLE_USE_GPS_FOR_CURRENT_LOCATION', {
            settings: {
                ...StateAPotamus.getState().settings,
                useGPSForCurrentLocation: !StateAPotamus.getState().settings.useGPSForCurrentLocation,
            }
        });
    };

    return {
        setCurrentLocationHandler: setCurrentLocationHandler.bind(this),
        toggleUseGPSForCurrentLocationHandler: toggleUseGPSForCurrentLocationHandler.bind(this),
    };
};
