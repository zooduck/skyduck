import { StateAPotamus } from '../state/stateapotamus';
import { generalEventHandlers } from '../event-handlers/general.event-handlers';
import { HeaderTemplate } from '../templates/header.template';

export const updateHeaderTitle = function updateHeaderTitle() {
    const { version, headerTitle, headerSubTitle } = StateAPotamus.getState();

    const header = this.shadowRoot.querySelector('#header');

    if (!header) {
        return;
    }

    const eventHandler = generalEventHandlers.call(this).toggleSettingsHandler;

    const newHeader = new HeaderTemplate(
        version,
        headerTitle,
        headerSubTitle,
        eventHandler
    ).html;

    header.replaceWith(newHeader);
};
