import { SettingsToggleTemplate } from './settings-toggle.template';
import { SearchTemplate } from './settings-search.template';
// eslint-disable-next-line no-unused-vars
import { GeocodeData } from '../interfaces/index';
import { LocationInfoTemplate } from './location-info.template';
import { StateAPotamus } from '../state/stateapotamus';

export class SubSettingsCurrentLocationTemplate {
    private _gpsToggleEventHandler: CallableFunction;
    private _setCurrentLocationEventHandler: CallableFunction;
    private _subSettingsCurrentLocation: HTMLElement;
    private _useGPSForCurrentLocation: boolean;
    private _userLocation: GeocodeData;

    constructor(gpsToggleEventHandler: CallableFunction, setCurrentLocationEventHandler: CallableFunction) {
        const { settings, userLocation } = StateAPotamus.getState();

        this._gpsToggleEventHandler = gpsToggleEventHandler;
        this._setCurrentLocationEventHandler = setCurrentLocationEventHandler;
        this._useGPSForCurrentLocation = settings.useGPSForCurrentLocation;
        this._userLocation = userLocation;

        this._buildSubSettingsCurrentLocation();
    }

    private _buildSubSettingsCurrentLocation(): void {
        this._subSettingsCurrentLocation = new DOMParser().parseFromString(`
            <div class="settings-grid"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        const useGPSForCurrentLocationToggleState = this._useGPSForCurrentLocation
            ? 'on'
            : 'off';

        this._subSettingsCurrentLocation.appendChild(new SettingsToggleTemplate(
            'useGPSForCurrentLocationToggle',
            'Use GPS',
            useGPSForCurrentLocationToggleState,
            this._gpsToggleEventHandler
        ).html);

        this._subSettingsCurrentLocation.appendChild(new SearchTemplate(
            'setCurrentLocationInput',
            'Set Location',
            'e.g. Hill Valley, California, USA',
            this._useGPSForCurrentLocation,
            this._setCurrentLocationEventHandler
        ).html);

        const locationDetails = {
            name: '',
            address: this._userLocation.address.formattedAddress,
        };

        this._subSettingsCurrentLocation.appendChild(new LocationInfoTemplate(
            locationDetails,
            'currentLocationDetails',
            '--user-location'
        ).html);
    }

    public get html(): HTMLElement {
        return this._subSettingsCurrentLocation;
    }
}
