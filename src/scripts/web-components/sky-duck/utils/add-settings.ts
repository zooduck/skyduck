import { GlassTemplate } from '../templates/glass.template';
import { SettingsTemplate } from '../templates/settings.template';
import { SubSettingsTemplate } from '../templates/sub-settings.template';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { settingsPageEventHandlers } from '../event-handlers/settings-page.event-handlers';

export const addSettings = function addSettings() {
    const settingsEl = getSettings.call(this);
    const settingsGlassEl = getSettingsGlass.call(this);
    const subSettingsEl = getSubSettings.call(this);
    const subSettingsGlassEl = getSubSettingsGlass.call(this);

    this.shadowRoot.appendChild(settingsGlassEl);
    this.shadowRoot.appendChild(settingsEl);
    this.shadowRoot.appendChild(subSettingsGlassEl);
    this.shadowRoot.appendChild(subSettingsEl);
};

const getSettings = function getSettings(): HTMLElement {
    const eventHandlers = settingsPageEventHandlers.call(this);

    return new SettingsTemplate(eventHandlers).html;
};

const getSettingsGlass = function getSettingsGlass(): HTMLElement {
    const eventHandler = generalEventHandlers.call(this).toggleSettingsHandler;

    return new GlassTemplate(
        'settingsGlass',
        '--settings',
        eventHandler
    ).html;
};

const getSubSettings = function getSubSettings(): HTMLElement {
    return new SubSettingsTemplate().html;
};

const getSubSettingsGlass = function getSubSettingsGlass(): HTMLElement {
    const eventHandler = generalEventHandlers.call(this).toggleSubSettingsHandler;

    return new GlassTemplate(
        'subSettingsGlass',
        '--sub-settings',
        eventHandler
    ).html;
};
