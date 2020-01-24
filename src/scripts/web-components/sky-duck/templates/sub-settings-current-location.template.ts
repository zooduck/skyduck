import { SettingsToggleTemplate } from './settings-toggle.template';
import { SearchTemplate } from './settings-search.template';
// eslint-disable-next-line no-unused-vars
import { GeocodeData } from '../interfaces/index';
import { LocationInfoTemplate } from './location-info.template';

export class SubSettingsCurrentLocationTemplate {
    private _gpsToggleEventHandler: any;
    private _setCurrentLocationEventHandler: any;
    private _subSettingsCurrentLocation: HTMLElement;
    private _useGPSForCurrentLocation: boolean;
    private _userLocation: GeocodeData;

    constructor(useGPSForCurrentLocation: boolean, userLocation: GeocodeData, gpsToggleEventHandler: any, setCurrentLocationEventHandler: any) {
        this._gpsToggleEventHandler = gpsToggleEventHandler;
        this._setCurrentLocationEventHandler = setCurrentLocationEventHandler;
        this._useGPSForCurrentLocation = useGPSForCurrentLocation;
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
            this._setCurrentLocationEventHandler
        ).html);

        const locationDetails = {
            name: '',
            address: this._userLocation.address.formattedAddress,
        };

        this._subSettingsCurrentLocation.appendChild(new LocationInfoTemplate(locationDetails, 'currentLocationDetails', '--user-location').html);

        if (this._useGPSForCurrentLocation) {
            const searchInput = this._subSettingsCurrentLocation.querySelector('zooduck-input') as HTMLElement;
            searchInput.setAttribute('disabled', '');
        }
    }

    public get html(): HTMLElement {
        return this._subSettingsCurrentLocation;
    }
}