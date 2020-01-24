export class LocationSettingsControlTemplate {
    private _locationSettingsControl: HTMLElement;

    constructor() {
        this._buildSettingsSetCurrentLocationControl();
    }

    private _buildSettingsSetCurrentLocationControl(): void {
        this._locationSettingsControl = new DOMParser().parseFromString(`
            <div
                class="settings__control --sub-settings"
                id="setCurrentLocationSetting">
                <div class="settings-control-name">
                    <h4 class="settings-control-name__title">Location Settings</h4>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._locationSettingsControl;
    }
}
