import { GoogleMapTemplate } from './google-map.template';
import { LocationInfoTemplate } from './location-info.template';
import { SettingsToggleTemplate } from './settings-toggle.template';
import { SearchTemplate } from './settings-search.template';
import { GeolocationErrorTemplate } from './geolocation-error.template';
import { Settings } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { UseCurrentLocationControlTemplate } from './use-current-location-control.template';
import { NotFoundTemplate } from './not-found.template';

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
    private _useCurrentLocationControl: HTMLElement;
    private _userDeniedGeolocation: boolean;

    constructor(googleMapsKey: string, settings: Settings, userDeniedGeolocation: boolean) {
        this._googleMapsKey = googleMapsKey;
        this._settings = settings;
        this._userDeniedGeolocation = userDeniedGeolocation;

        this._buildSettings();
    }

    private _buildSettings(): void {
        this._settingsPage = new DOMParser().parseFromString(`
            <div
                id="settings"
                class="settings --render-once">
                <div class="settings__grid"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._geolocationError = new GeolocationErrorTemplate().html;

        const { locationDetails } = this._settings;

        if (!locationDetails.name) {
            this._map = new NotFoundTemplate('COORDS_FOR_MAP_NOT_FOUND', 'map').html;
            this._locationInfo = new NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND', 'locationInfo').html;
        } else {
            this._map = new GoogleMapTemplate(this._googleMapsKey, this._settings.locationDetails.coords).html;
            this._locationInfo = new LocationInfoTemplate(this._settings.locationDetails).html;
        }
        this._search = new SearchTemplate().html;
        this._extendedForecastToggle = this._buildExtendedForecastToggle();
        this._activeCarouselToggle = this._buildActiveCarouselToggle();
        this._useCurrentLocationControl = this._buildUseCurrentLocationControl();

        const settingsGrid = this._settingsPage.querySelector('.settings__grid');

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

    private _buildUseCurrentLocationControl(): HTMLElement {
        return new UseCurrentLocationControlTemplate().html;
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

    public get useCurrentLocationControl():  HTMLElement {
        return this._useCurrentLocationControl;
    }
}