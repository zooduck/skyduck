// eslint-disable-next-line no-unused-vars
import { GeocodeData } from '../interfaces/index';

export class UseCurrentLocationControlTemplate {
    private _useCurrentLocationControl: HTMLElement;
    private _userLocation: GeocodeData;

    constructor(userLocation: GeocodeData) {
        this._userLocation = userLocation;

        this._buildUseCurrentLocationControl();
    }

    private _buildUseCurrentLocationControl(): void {
        this._useCurrentLocationControl = new DOMParser().parseFromString(`
            <div
                class="settings__control"
                id="useCurrentLocationSetting">
                <div class="use-current-location-setting-col1">
                    <h4>Use Current Location</h4>
                    <span class="use-current-location-setting-col1__location-name">${this._userLocation.name}</span>
                </div>
                <zooduck-icon-location
                    id="useCurrentLocationControl"
                    size="35"
                    color="var(--icongray)">
                </zooduck-icon-location>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._useCurrentLocationControl;
    }
}
