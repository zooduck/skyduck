import { StateAPotamus } from './stateapotamus';
import { geocodeLookup } from '../fetch/geocode-lookup.fetch';
import { SubSettingsCurrentLocationTemplate } from '../templates/sub-settings-current-location.template';
import { getCurrentPosition } from '../utils/get-current-position';
import { reverseGeocodeLookup } from '../fetch/reverse-geocode-lookup.fetch';
import { formatAddress } from '../utils/format-address';
import { clearLoaderInfoDisplay } from '../utils/clear-loader-info-display';

/* eslint-disable no-unused-vars */
import {
    GeocodeData,
    StateActions,
    HTMLZooduckCarouselElement,
} from '../interfaces/index';
/* eslint-enable no-unused-vars */

import { ClubListCarouselTemplate } from '../templates/club-list-carousel.template';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { sortClubs } from '../utils/sort-clubs';
import { updateSettingsPage } from '../utils/update-settings-page';
import { updateHeaderTitle } from '../utils/update-header-title';
import { getForecast } from '../utils/get-forecast';
import { revertContentOnError } from '../utils/revert-content-on-error';
import { resetModifierClasses } from '../utils/reset-modifier-classes';
import { getClubData } from '../utils/get-club-data';
import { getLoaderInfoElements } from '../utils/get-loader-info-elements';
import { setContent } from '../utils/set-content';
import { subSettingsLocationSettingsEventHandlers } from '../event-handlers/sub-settings-location-settings.event-handlers';
import { updateForecastHeader } from '../utils/update-forecast-header';

export const stateActions = function stateActions(): StateActions {
    return {
        CLEAR_ERROR: () => {
            setContent.call(this);
        },
        CLUB_CHANGE: async () => {
            const { club, clubs, hasLoaded, isLoading } = StateAPotamus.getState();

            if (hasLoaded && isLoading) {
                return;
            }

            StateAPotamus.dispatch('SET_LOADING', {
                isLoading: true,
            });

            if (!clubs) {
                revertContentOnError.call(this);

                return;
            }

            const clubData = getClubData();

            if (!clubData) {
                const error = `Could not find club "${club}" in the Skyduck database. Try searching by location instead.`;

                StateAPotamus.dispatch('ERROR', {
                    error,
                });

                revertContentOnError.call(this);

                return;
            }

            StateAPotamus.dispatch('SET_CURRENT_CLUB', {
                currentClub: clubData,
            });

            try {
                await getForecast.call(this);

                StateAPotamus.dispatch('CLEAR_ERROR', {
                    error: null,
                });
            } catch (err) {
                StateAPotamus.dispatch('ERROR', {
                    error: err,
                });

                revertContentOnError.call(this);
            }
        },
        CLUB_LIST_CAROUSEL_SLIDE_CHANGE: () => {
            if (StateAPotamus.getState().settings.activeCarousel !== 'club-list') {
                return;
            }

            updateHeaderTitle.call(this);
        },
        ERROR: () => {
            // Do nothing
        },
        FORECAST_CAROUSEL_SLIDE_CHANGE: () => {
            const { currentForecastSlide, hasLoaded } = StateAPotamus.getState();
            [
                this.shadowRoot.querySelector('#forecastCarouselStandard'),
                this.shadowRoot.querySelector('#forecastCarouselExtended')
            ].forEach((forecastCarousel: HTMLZooduckCarouselElement) => {
                if (forecastCarousel.currentslide === currentForecastSlide) {
                    return;
                }

                forecastCarousel.currentslide = currentForecastSlide;
            });

            if (!hasLoaded) {
                return;
            }

            updateForecastHeader.call(this);
        },
        GEOCODE_DATA_CHANGE: () => {
            // Do nothing
        },
        GET_FORECAST_BY_CLUB: () => {
            const { timezone } = StateAPotamus.getState().forecast.weather;
            const { name, place: address, site, latitude, longitude } = getClubData();

            const coords = {
                latitude,
                longitude,
            };

            StateAPotamus.dispatch('LOCATION_DETAILS_CHANGE', {
                headerSubTitle: address,
                headerTitle: name,
                locationDetails: {
                    name,
                    address,
                    site,
                    timezone,
                    coords,
                },
                settings: {
                    ...StateAPotamus.getState().settings,
                    activeCarousel: 'forecast',
                },
            });
        },
        GET_FORECAST_BY_LOCATION: () => {
            const site = '';
            const { latitude, longitude, timezone, } = StateAPotamus.getState().forecast.weather;
            const { countryRegion, formattedAddress, } = StateAPotamus.getState().forecast;
            const coords = {
                latitude,
                longitude,
            };

            const formattedAddressPieces = formattedAddress.split(',').map((piece: string) => {
                return piece.trim();
            });

            if (!formattedAddressPieces.includes(countryRegion)) {
                formattedAddressPieces.push(countryRegion);
            }

            const name = formattedAddressPieces[0];
            const address = formattedAddressPieces.slice(1).join(',');

            StateAPotamus.dispatch('LOCATION_DETAILS_CHANGE', {
                headerSubTitle: address,
                headerTitle: name,
                locationDetails: {
                    name,
                    address,
                    site,
                    timezone,
                    coords,
                },
                settings: {
                    ...StateAPotamus.getState().settings,
                    activeCarousel: 'forecast',
                },
            });
        },
        HAS_LOADED: () => {
            this.dispatchEvent(new CustomEvent('load'));
        },
        IMAGES_READY: () => {
            // Do nothing
        },
        LOCATION_CHANGE: () => {
            const { hasLoaded, isLoading, location } = StateAPotamus.getState();

            if (hasLoaded && isLoading) {
                alert('has loaded and is loading');
                return;
            }

            StateAPotamus.dispatch('SET_LOADING', {
                isLoading: true,
            });

            geocodeLookup(location).then(async (response) => {
                StateAPotamus.dispatch('GEOCODE_DATA_CHANGE', {
                    geocodeData: response,
                });

                try {
                    await getForecast.call(this);

                    StateAPotamus.dispatch('CLEAR_ERROR', {
                        error: null,
                    });
                } catch (err) {
                    StateAPotamus.dispatch('ERROR', {
                        error: err,
                    });

                    revertContentOnError.call(this);
                }
            }).catch((err) => {
                StateAPotamus.dispatch('GEOCODE_DATA_CHANGE', {
                    geocodeData: null,
                });

                StateAPotamus.dispatch('ERROR', {
                    error: err,
                });

                revertContentOnError.call(this);
            });
        },
        LOCATION_DETAILS_CHANGE: () => {
            updateHeaderTitle.call(this);
            updateSettingsPage.call(this, 'locationDetails');
            updateSettingsPage.call(this, 'activeCarousel');
        },
        NEAREST_CLUB_CHANGE: () => {
            // Do nothing
        },
        SET_CLUBS: () => {
            const {
                hasLoaded,
                clubsSortedByCountry,
                clubCountries,
                userLocation
            } = StateAPotamus.getState();

            if (!hasLoaded) {
                return;
            }

            const clubListCarousel = new ClubListCarouselTemplate(
                clubsSortedByCountry,
                clubCountries,
                userLocation,
                generalEventHandlers.call(this).onClubListCarouselSlideChangeHandler,
                generalEventHandlers.call(this).onClubChangeHandler,
            ).html;

            this.shadowRoot.querySelector('#clubListCarousel').replaceWith(clubListCarousel);
        },
        SET_CURRENT_CLUB: () => {
            // Do nothing
        },
        SET_LOADED: () => {
            this.classList.remove(this._modifierClasses.loading);

            const loaderInfoElements = getLoaderInfoElements.call(this);

            clearLoaderInfoDisplay(loaderInfoElements);
        },
        SET_LOADING: () => {
            this.classList.remove(this._modifierClasses.ready);
            this.classList.add(this._modifierClasses.loading);
        },
        SET_POSITION: () => {
            // Do nothing
        },
        SET_READY: () => {
            resetModifierClasses.call(this);

            this.classList.add(this._modifierClasses.ready);
        },
        SETUP: () => {
            // Do nothing
        },
        SORT_CLUBS: () => {
            const { clubs, userLocation } = StateAPotamus.getState();

            if (!clubs) {
                return;
            }

            try {
                sortClubs(clubs, userLocation);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        },
        TOGGLE_ACTIVE_CAROUSEL: () => {
            [
                this._modifierClasses.activeCarouselClubList,
                this._modifierClasses.activeCarouselForecast
            ].forEach((modifierClass: string) => {
                this.classList.remove(modifierClass);
            });

            const activeCarouselModifierClass = StateAPotamus.getState().settings.activeCarousel === 'forecast'
                ? this._modifierClasses.activeCarouselForecast
                : this._modifierClasses.activeCarouselClubList;

            this.classList.add(activeCarouselModifierClass);

            updateHeaderTitle.call(this);
        },
        TOGGLE_FORECAST_DISPLAY_MODE: () => {
            [
                this._modifierClasses.forecastDisplayModeExtended,
                this._modifierClasses.forecastDisplayModeStandard
            ].forEach((modifierClass: string) => {
                this.classList.remove(modifierClass);
            });
            const forecastDisplayModeModifierClass = StateAPotamus.getState().settings.forecastDisplayMode === 'extended'
                ? this._modifierClasses.forecastDisplayModeExtended
                : this._modifierClasses.forecastDisplayModeStandard;

            this.classList.add(forecastDisplayModeModifierClass);
        },
        TOGGLE_SETTINGS: () => {
            this.classList.toggle(this._modifierClasses.settingsActive);
        },
        TOGGLE_SUB_SETTINGS: () => {
            this.classList.toggle(this._modifierClasses.subSettingsActive);
        },
        TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS: () => {
            const subSettings = this.shadowRoot.querySelector('#subSettings');
            const subSettingsSettingsGrid = subSettings.querySelector('.settings-grid');

            const { toggleUseGPSForCurrentLocationHandler, setCurrentLocationHandler } = subSettingsLocationSettingsEventHandlers.call(this);

            const locationSettings = new SubSettingsCurrentLocationTemplate(
                toggleUseGPSForCurrentLocationHandler,
                setCurrentLocationHandler.bind(this)
            ).html;

            subSettingsSettingsGrid.replaceWith(locationSettings);

            this.classList.toggle(this._modifierClasses.subSettingsActive);
        },
        TOGGLE_USE_GPS_FOR_CURRENT_LOCATION: async () => {
            const setCurrentLocationInput = this.shadowRoot.querySelector('#setCurrentLocationInput') as HTMLInputElement;
            setCurrentLocationInput.disabled = StateAPotamus.getState().settings.useGPSForCurrentLocation;

            if (StateAPotamus.getState().settings.useGPSForCurrentLocation) {
                try {
                    const position = await getCurrentPosition();

                    StateAPotamus.dispatch('SET_POSITION', {
                        position,
                    });

                    const geocodeData: GeocodeData = await reverseGeocodeLookup(StateAPotamus.getState().position.coords);

                    StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                        userLocation: geocodeData,
                    });
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            }
        },
        USER_LOCATION_CHANGE: () => {
            updateSettingsPage.call(this, 'userLocation');

            const { hasLoaded } = StateAPotamus.getState();

            if (hasLoaded) {
                StateAPotamus.dispatch('SORT_CLUBS');
            }

            const currentLocationDetails = this.shadowRoot.querySelector('#currentLocationDetails');
            const setCurrentLocationInput = this.shadowRoot.querySelector('#setCurrentLocationInput') as HTMLInputElement;

            if (!currentLocationDetails || !setCurrentLocationInput) {
                return;
            }

            currentLocationDetails.innerHTML = formatAddress(StateAPotamus.getState().userLocation.name);
            setCurrentLocationInput.value = '';
        },
        USER_DENIED_GEOLOCATION: () => {
            // Do nothing
        },
    };
};
