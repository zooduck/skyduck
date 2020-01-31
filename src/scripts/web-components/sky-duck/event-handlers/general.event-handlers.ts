// eslint-disable-next-line no-unused-vars
import { EventHandlers } from '../interfaces/index';
import { StateAPotamus } from '../state/stateapotamus';

export const generalEventHandlers = function generalEventHandlers(): EventHandlers {
    const onClubChangeHandler: CallableFunction = (club: string): void => {
        this.club = club;

        StateAPotamus.dispatch('TOGGLE_ACTIVE_CAROUSEL', {
            headerTitle: StateAPotamus.getState().locationDetails.name,
            settings: {
                ...StateAPotamus.getState().settings,
                activeCarousel: 'forecast',
            }
        });
    };

    const onClubListCarouselSlideChangeHandler = (e: CustomEvent): void => {
        const { index: clubCountryIndex } = e.detail.currentSlide;
        const clubListCountry = StateAPotamus.getState().clubCountries[clubCountryIndex];

        StateAPotamus.dispatch('CLUB_LIST_CAROUSEL_SLIDE_CHANGE', {
            currentClubListCountry: clubListCountry,
            headerTitle: clubListCountry,
        });
    };

    const onForecastCarouselSlideChangeHandler = (e: CustomEvent): void => {
        const { id: slideNumber } = e.detail.currentSlide;

        StateAPotamus.dispatch('FORECAST_CAROUSEL_SLIDE_CHANGE', {
            currentForecastSlide: slideNumber,
        });
    };

    const toggleSettingsHandler = (): void => {
        StateAPotamus.dispatch('TOGGLE_SETTINGS', {
            settingsActive: !StateAPotamus.getState().settingsActive,
        });
    };

    const toggleSubSettingsHandler = (): void => {
        StateAPotamus.dispatch('TOGGLE_SUB_SETTINGS', {
            subSettingsActive: !StateAPotamus.getState().subSettingsActive,
        });
    };

    return {
        onClubChangeHandler: onClubChangeHandler.bind(this),
        onClubListCarouselSlideChangeHandler: onClubListCarouselSlideChangeHandler.bind(this),
        onForecastCarouselSlideChangeHandler: onForecastCarouselSlideChangeHandler.bind(this),
        toggleSettingsHandler: toggleSettingsHandler.bind(this),
        toggleSubSettingsHandler: toggleSubSettingsHandler.bind(this),
    };
};
