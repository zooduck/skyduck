import { reverseGeocodeLookup } from '../fetch/reverse-geocode-lookup.fetch';
import { geocodeLookup } from '../fetch/geocode-lookup.fetch';
import { getCurrentPosition } from '../utils/get-current-position';
// eslint-disable-next-line no-unused-vars
import { GeocodeData } from '../interfaces/index';
import { formatAddress } from '../utils/format-address';

// @WARNING: Arrow functions are intentionally NOT being used here
// since they cannot be bound to "this" using .bind()

export const onSearchSubmit = function onSearchSubmit(e: CustomEvent): void {
    const { value } = e.detail;
    this.location = value;
};

export const setCurrentLocation = async function setCurrentLocationHandler(e: CustomEvent): Promise<void> {
    const { value: requestedLocation } = e.detail;

    try {
        const geocodeData = await geocodeLookup(requestedLocation);
        this._state.userLocation = geocodeData;

        const currentLocationDetails = this.shadowRoot.querySelector('#currentLocationDetails');
        currentLocationDetails.innerHTML = formatAddress(this._state.userLocation.name);

        const setCurrentLocationInput = this.shadowRoot.querySelector('#setCurrentLocationInput');
        setCurrentLocationInput.value = '';
    } catch (err) {
        this._error = err;
        this._revertContentOnError();
    }
};

export const setCurrentLocationSetting = function setCurrentLocationSetting(): void {
    this._state.currentSubSettings = this._subSettings.locationSettings;
};

export const toggleActiveCarousel = function toggleActiveCarousel(): void {
    this._state.settings.activeCarousel = this._state.settings.activeCarousel === 'forecast'
        ? 'club-list'
        : 'forecast';
};

export const toggleForecastDisplayMode = function toggleForecastDisplayMode(): void {
    this._state.settings.forecastDisplayMode = this._state.settings.forecastDisplayMode === 'extended'
        ? 'standard'
        : 'extended';
};

export const toggleSettings = function toggleSettings(): void {
    this._state.settingsActive = !this._state.settingsActive;
};

export const toggleSubSettings = function toggleSubSettings(): void {
    this._state.subSettingsActive = !this._state.subSettingsActive;
};

export const toggleUseGPSForCurrentLocation = async function toggleUseGPSForCurrentLocation(): Promise<void> {
    this._state.settings.useGPSForCurrentLocation = !this._state.settings.useGPSForCurrentLocation;
    this.shadowRoot.querySelector('#setCurrentLocationInput').disabled = this._state.settings.useGPSForCurrentLocation;

    if (this._state.settings.useGPSForCurrentLocation) {
        try {
            this._position = await getCurrentPosition();
            const geocodeData: GeocodeData = await reverseGeocodeLookup(this._position.coords);
            this._state.userLocation = geocodeData;

            const currentLocationDetails = this.shadowRoot.querySelector('#currentLocationDetails');
            currentLocationDetails.innerHTML = formatAddress(this._state.userLocation.name);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    }
};

export const useCurrentLocationControl = function useCurrentLocationControl(): void {
    try {
        this.location = this._state.userLocation.name;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
};
