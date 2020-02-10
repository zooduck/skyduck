import { StateAPotamus } from '../state/stateapotamus';

export const resetModifierClasses = function resetModifierClasses() {
    const excludedClasses = [
        this._modifierClasses.includeNighttimeWeather,
        this._modifierClasses.loading,
        this._modifierClasses.settingsActive,
        this._modifierClasses.subSettingsActive,
        this._modifierClasses.userDeniedGeolocation,
    ];

    Object.keys(this._modifierClasses).forEach((key: string) => {
        const modifierClassToRemove = this._modifierClasses[key];

        if (excludedClasses.includes(modifierClassToRemove)) {
            return;
        }

        this.classList.remove(modifierClassToRemove);
    });

    const activeCarouselModifier =  StateAPotamus.getState().settings.activeCarousel === 'club-list'
        ? this._modifierClasses.activeCarouselClubList
        : this._modifierClasses.activeCarouselForecast;
    const forecastDisplayModeModifier = StateAPotamus.getState().settings.forecastDisplayMode === 'extended'
        ? this._modifierClasses.forecastDisplayModeExtended
        : this._modifierClasses.forecastDisplayModeStandard;

    this.classList.add(activeCarouselModifier);
    this.classList.add(forecastDisplayModeModifier);
};
