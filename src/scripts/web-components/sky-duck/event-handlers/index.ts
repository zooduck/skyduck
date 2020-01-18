import { reverseGeocodeLookup } from '../fetch/reverse-geocode-lookup.fetch';

// @WARNING: Arrow functions are intentionally NOT being used here
// since they cannot be bound to "this" using .bind()

export const onSearchSubmit = function onSearchSubmit(e: CustomEvent): void {
    const { value } = e.detail;
    this.location = value;
};

export const reverseGeocodeLookupControl = async function reverseGeocodeLookupControl(): Promise<void> {
    if (!this._position) {
        return;
    }

    this._setLoading();

    try {
        const reverseGeocodeLookupResponse = await reverseGeocodeLookup(this._position.coords);
        this._geocodeData = reverseGeocodeLookupResponse;
        const { name: location } = this._geocodeData;

        if (!location) {
            // If reverse geocode lookup is successful but returns an empty value for "name"
            this._error = 'Reverse geocode lookup failed. Unknown error.';
            this._setLoaderError();

            return;
        }

        this.location = location;
    } catch (err) {
        this._error = err;
        this._setLoaderError();
    }
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
