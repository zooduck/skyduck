import { GoogleMapTemplate } from './google-map.template';
import { LocationInfoTemplate } from './location-info.template';
import { SettingsToggleTemplate } from './settings-toggle.template';
import { SearchTemplate } from './settings-search.template';
import { GeolocationErrorTemplate } from './geolocation-error.template';
import { Settings, GeocodeData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { UseCurrentLocationControlTemplate } from './settings-use-current-location-control.template';
import { NotFoundTemplate } from './not-found.template';
import { LocationSettingsControlTemplate } from './settings-location-settings-control.template';

export class SettingsTemplate {
    private _geolocationError: HTMLElement;
    private _googleMapsKey: string;
    private _locationInfo: HTMLElement;
    private _map: HTMLElement;
    private _activeCarouselToggle: HTMLElement;
    private _extendedForecastToggle: HTMLElement;
    private _search: HTMLElement;
    private _settings: Settings;
    private _settingsPage: HTMLElement;
    private _setCurrentLocationControl: HTMLElement;
    private _useCurrentLocationControl: HTMLElement;
    private _userDeniedGeolocation: boolean;
    private _userLocation: GeocodeData;

    constructor(googleMapsKey: string, settings: Settings, userLocation: GeocodeData, userDeniedGeolocation: boolean) {
        this._googleMapsKey = googleMapsKey;
        this._settings = settings;
        this._userLocation = userLocation;
        this._userDeniedGeolocation = userDeniedGeolocation;

        this._buildSettings();
    }

    private _buildSettings(): void {
        this._settingsPage = new DOMParser().parseFromString(`
            <div
                id="settings"
                class="settings --render-once">
                <div class="settings-grid"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._geolocationError = new GeolocationErrorTemplate().html;

        const { locationDetails } = this._settings;

        if (!locationDetails.name) {
            this._map = new NotFoundTemplate('COORDS_FOR_MAP_NOT_FOUND', 'map').html;
            this._locationInfo = new NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND', 'locationInfo').html;
        } else {
            this._map = new GoogleMapTemplate(this._googleMapsKey, locationDetails.coords).html;
            this._locationInfo = new LocationInfoTemplate(locationDetails, 'locationInfo').html;
        }
        this._search = new SearchTemplate('searchInput', 'Location Search', 'e.g. Perris, CA 92570, USA').html;
        this._extendedForecastToggle = this._buildExtendedForecastToggle();
        this._activeCarouselToggle = this._buildActiveCarouselToggle();
        this._useCurrentLocationControl = this._buildUseCurrentLocationControl();
        this._setCurrentLocationControl = this._buildLocationSettingsControl();

        const settingsGrid = this._settingsPage.querySelector('.settings-grid');

        if (this._userDeniedGeolocation) {
            settingsGrid.appendChild(this._geolocationError);
        }

        settingsGrid.appendChild(this._search);
        settingsGrid.appendChild(this._map);
        settingsGrid.appendChild(this._locationInfo);
        settingsGrid.appendChild(this._extendedForecastToggle);
        settingsGrid.appendChild(this._activeCarouselToggle);

        if (this._userDeniedGeolocation) {
            return;
        }

        settingsGrid.appendChild(this._useCurrentLocationControl);
        settingsGrid.appendChild(this._setCurrentLocationControl);
    }

    private _buildActiveCarouselToggle(): HTMLElement {
        const toggleState = this._settings.activeCarousel === 'club-list'
            ? 'on'
            : 'off';

        const [id, desc] = [
            'activeCarouselSetting',
            'View Clubs',
        ];

        return new SettingsToggleTemplate(id, desc, toggleState).html;
    }

    private _buildExtendedForecastToggle(): HTMLElement {
        const toggleState = this._settings.forecastDisplayMode === 'extended'
            ? 'on'
            : 'off';
        const [id, desc] = [
            'forecastDisplayModeSetting',
            'Hourly Forecast',
        ];

        return new SettingsToggleTemplate(id, desc, toggleState).html;
    }

    private _buildLocationSettingsControl(): HTMLElement {
        return new LocationSettingsControlTemplate().html;
    }

    private _buildUseCurrentLocationControl(): HTMLElement {
        return new UseCurrentLocationControlTemplate(this._userLocation).html;
    }

    public get activeCarouselToggle(): HTMLElement {
        return this._activeCarouselToggle;
    }

    public get extendedForecastToggle(): HTMLElement {
        return this._extendedForecastToggle;
    }

    public get geolocationError(): HTMLElement {
        return this._geolocationError;
    }

    public get html(): HTMLElement {
        return this._settingsPage;
    }

    public get locationInfo(): HTMLElement {
        return this._locationInfo;
    }

    public get map(): HTMLElement {
        return this._map;
    }

    public get search(): HTMLElement {
        return this._search;
    }

    public get setCurrentLocationControl(): HTMLElement {
        return this._setCurrentLocationControl;
    }

    public get useCurrentLocationControl():  HTMLElement {
        return this._useCurrentLocationControl;
    }
}
