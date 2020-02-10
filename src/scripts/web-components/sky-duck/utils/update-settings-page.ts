import { SettingsTemplate } from '../templates/settings.template';
import { StateAPotamus } from '../state/stateapotamus';
import { settingsPageEventHandlers } from '../event-handlers/settings-page.event-handlers';

export const updateSettingsPage = async function updateSettingsPage(prop: string) {
    const settingsPage = this.shadowRoot.querySelector('#settings');

    if (!settingsPage || !StateAPotamus.getState().locationDetails) {
        return;
    }

    const eventHandlers = settingsPageEventHandlers.call(this);
    const newSettings = new SettingsTemplate(eventHandlers);

    switch (prop) {
    case 'locationDetails':
        settingsPage.querySelector('#map').replaceWith(newSettings.map);
        settingsPage.querySelector('#locationInfo').replaceWith(newSettings.locationInfo);

        break;
    case 'activeCarousel':
        settingsPage.querySelector('#activeCarouselSetting').replaceWith(newSettings.activeCarouselToggle);

        break;
    case 'forecastDisplayMode':
        settingsPage.querySelector('#forecastDisplayModeSetting').replaceWith(newSettings.extendedForecastToggle);

        break;
    case 'includeNighttimeWeather':
        settingsPage.querySelector('#includeNighttimeWeatherSetting').replaceWith(newSettings.includeNighttimeWeatherToggle);

        break;
    case 'userLocation':
        settingsPage.querySelector('#useCurrentLocationSetting').replaceWith(newSettings.useCurrentLocationControl);

        break;
    default: // Do nothing
    }
};
