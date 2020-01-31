import { StateAPotamus } from '../state/stateapotamus';
import { geocodeLookup } from '../fetch/geocode-lookup.fetch';
import { revertContentOnError } from './revert-content-on-error';

export const setCurrentLocationHandler = async function setCurrentLocationHandler(e: CustomEvent): Promise<void> {
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
