import { State } from '../interfaces/index'; //  eslint-disable-line no-unused-vars

export const state: State = {
    currentClubListCountry: '',
    currentForecastSlide: 1,
    currentSubSettings: '',
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
        },
        useGPSForCurrentLocation: true,
    },
    settingsActive: false,
    subSettingsActive: false,
    userDeniedGeolocation: false,
    userLocation: {
        query: '',
        name: '',
        address: {
            addressLine: '',
            adminDistrict: '',
            countryRegion: '',
            formattedAddress: '',
            locality: '',
            postalCode: '',
        },
        latitude: null,
        longitude: null,
    },
    version: '',
};
