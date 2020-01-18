import { State } from '../interfaces/index'; //  eslint-disable-line no-unused-vars

export const state: State = {
    currentClubListCountry: '',
    currentForecastSlide: 1,
    hasLoaded: false,
    headerTitle: '',
    isLoading: false,
    googleMapsKey: '',
    settings: {
        activeCarousel: 'forecast',
        forecastDisplayMode: 'standard',
        locationDetails: {
            name: '',
            address: '',
            timezone: '',
            coords: {
                latitude: null,
                longitude: null,
            }
        }
    },
    settingsActive: false,
    userDeniedGeolocation: false,
    version: '',
};
