import { SettingsTemplate } from '../templates/settings.template';
import { StateAPotamus } from '../state/stateapotamus';
import { settingsPageEventHandlers } from '../event-handlers/settings-page.event-handlers';
import { wait } from './wait/wait';

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
        await wait(this._transitionSpeedInMillis); // Let the toggle switch animation complete

        settingsPage.querySelector('#activeCarouselSetting').replaceWith(newSettings.activeCarouselToggle);

        break;
    case 'forecastDisplayMode':
        await wait(this._transitionSpeedInMillis); // Let the toggle switch animation complete

        settingsPage.querySelector('#forecastDisplayModeSetting').replaceWith(newSettings.extendedForecastToggle);

        break;
    case 'userLocation':
        settingsPage.querySelector('#useCurrentLocationSetting').replaceWith(newSettings.useCurrentLocationControl);

        break;
    default: // Do nothing
    }
};
