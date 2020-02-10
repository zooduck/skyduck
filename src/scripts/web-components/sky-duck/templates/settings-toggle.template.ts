import { ToggleState } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class SettingsToggleTemplate {
    private _disabled: boolean;
    private _eventHandler: CallableFunction;
    private _id: string;
    private _title: string;
    private _toggleState: ToggleState;
    private _settingsToggle: HTMLElement;
    private _subTitle: string;

    constructor(
        id: string,
        title: string,
        subtitle: string,
        toggleState?: ToggleState,
        disabled?: boolean,
        eventHandler?: CallableFunction) {
        this._id = id || '';
        this._eventHandler = eventHandler;
        this._title = title || '';
        this._subTitle = subtitle || '';
        this._toggleState = toggleState || 'off';
        this._disabled = disabled;

        this._buildSettingsToggle();
    }

    private _buildSettingsToggle(): void {
        const disabled = this._disabled
            ? 'disabled'
            : '';
        this._settingsToggle = new DOMParser().parseFromString(`
            <div
                class="settings__control"
                id="${this._id}">
                <div class="settings-control-name">
                    <h4 class="settings-control-name__title">${this._title}</h4>
                    <span class="settings-control-name__subtitle">${this._subTitle}</span>
                </div>
                <zooduck-icon-toggle
                    ${disabled}
                    togglestate="${this._toggleState}"
                    toggleoncolor="var(--lightskyblue)">
                </zooduck-icon-toggle>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._eventHandler) {
            return;
        }

        this._settingsToggle.querySelector('zooduck-icon-toggle').addEventListener('zooduck-icon-toggle:change', () => {
            this._eventHandler();
        });
    }

    public get html():  HTMLElement {
        return this._settingsToggle;
    }
}
