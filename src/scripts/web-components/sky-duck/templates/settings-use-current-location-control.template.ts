// eslint-disable-next-line no-unused-vars
import { GeocodeData } from '../interfaces/index';

export class UseCurrentLocationControlTemplate {
    private _eventHandler: CallableFunction;
    private _useCurrentLocationControl: HTMLElement;
    private _userLocation: GeocodeData;

    constructor(userLocation: GeocodeData, eventHandler?: CallableFunction) {
        this._eventHandler = eventHandler;
        this._userLocation = userLocation;

        this._buildSettingsUseCurrentLocationControl();
    }

    private _buildSettingsUseCurrentLocationControl(): void {
        this._useCurrentLocationControl = new DOMParser().parseFromString(`
            <div
                class="settings__control"
                id="useCurrentLocationSetting">
                <div class="settings-control-name">
                    <h4 class="settings-control-name__title">Use Current Location</h4>
                    <span class="settings-control-name__subtitle">${this._userLocation.name}</span>
                </div>
                <zooduck-icon-location
                    id="useCurrentLocationControl"
                    size="35"
                    color="var(--icongray)">
                </zooduck-icon-location>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._eventHandler) {
            return;
        }

        this._useCurrentLocationControl.addEventListener('click', (e: Event) => {
            this._eventHandler(e);
        });
    }

    public get html(): HTMLElement {
        return this._useCurrentLocationControl;
    }
}
