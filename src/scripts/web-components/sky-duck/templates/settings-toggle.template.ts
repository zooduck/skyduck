import { ToggleState } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class SettingsToggleTemplate {
    private _description: string;
    private _id: string;
    private _toggleState: ToggleState;
    private _settingsToggle: HTMLElement;

    constructor(id: string, description: string, toggleState?: ToggleState) {
        this._id = id || '';
        this._description = description || '';
        this._toggleState = toggleState || 'off';

        this._buildSettingsToggle();
    }

    private _buildSettingsToggle(): void {
        this._settingsToggle = new DOMParser().parseFromString(`
            <div
                class="settings__control"
                id="${this._id}">
                <div class="settings-control-name">
                    <h4 class="settings-control-name__title">${this._description}</h4>
                </div>
                <zooduck-icon-toggle
                    togglestate="${this._toggleState}"
                    toggleoncolor="var(--lightskyblue)">
                </zooduck-icon-toggle>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html():  HTMLElement {
        return this._settingsToggle;
    }
}
