import { GoogleMapTemplate } from './google-map.template';
import { LocationInfoTemplate } from './location-info.template';
import { SettingsToggleTemplate } from './settings-toggle.template';
import { SearchTemplate } from './settings-search.template';
import { GeolocationErrorTemplate } from './geolocation-error.template';
import { Settings, GeocodeData, SettingsPageEventHandlers, LocationDetails, SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { UseCurrentLocationControlTemplate } from './settings-use-current-location-control.template';
import { NotFoundTemplate } from './not-found.template';
import { LocationSettingsControlTemplate } from './settings-location-settings-control.template';
import { StateAPotamus } from '../state/stateapotamus';

export class SettingsTemplate {
    private _ACTIVE_CAROUSEL_SETTING_ID: string;
    private _FORECAST_DISPLAY_MODE_SETTING_ID: string;
    private _GOOGLE_MAP_ID: string;
    private _INCLUDE_NIGHTTIME_WEATHER_SETTING_ID: string;
    private _LOCATION_INFO_ID: string;
    private _LOCATION_SEARCH_INPUT_ID: string;
    private _SET_CURRENT_LOCATION_SETTING_ID: string;
    private _USE_CURRENT_LOCATION_SETTING_ID: string;

    private _clubs: SkydiveClub[];
    private _geolocationError: HTMLElement;
    private _googleMapsKey: string;
    private _locationDetails: LocationDetails;
    private _locationInfo: HTMLElement;
    private _map: HTMLElement;
    private _activeCarouselToggle: HTMLElement;
    private _extendedForecastToggle: HTMLElement;
    private _includeNighttimeWeatherToggle: HTMLElement;
    private _search: HTMLElement;
    private _settings: Settings;
    private _settingsPage: HTMLElement;
    private _settingsPageEventHandlers: SettingsPageEventHandlers;
    private _setCurrentLocationControl: HTMLElement;
    private _useCurrentLocationControl: HTMLElement;
    private _userDeniedGeolocation: boolean;
    private _userLocation: GeocodeData;

    constructor(settingsPageEventHandlers: SettingsPageEventHandlers) {
        const { clubs, googleMapsKey, settings, locationDetails, userLocation, userDeniedGeolocation } = StateAPotamus.getState();

        this._ACTIVE_CAROUSEL_SETTING_ID = 'activeCarouselSetting';
        this._GOOGLE_MAP_ID = 'map';
        this._FORECAST_DISPLAY_MODE_SETTING_ID = 'forecastDisplayModeSetting';
        this._INCLUDE_NIGHTTIME_WEATHER_SETTING_ID = 'includeNighttimeWeatherSetting';
        this._LOCATION_INFO_ID = 'locationInfo';
        this._LOCATION_SEARCH_INPUT_ID = 'locationSearchInput';
        this._SET_CURRENT_LOCATION_SETTING_ID = 'setCurrentLocationSetting';
        this._USE_CURRENT_LOCATION_SETTING_ID = 'useCurrentLocationSetting';

        this._clubs = clubs;
        this._googleMapsKey = googleMapsKey;
        this._locationDetails = locationDetails;
        this._settings = settings;
        this._settingsPageEventHandlers = settingsPageEventHandlers;
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

        this._geolocationError = this._buildGeolocationError();
        this._map = this._buildMap();
        this._locationInfo = this._buildLocationInfo();
        this._search = this._buildLocationSearchInput();
        this._extendedForecastToggle = this._buildExtendedForecastToggle();
        this._activeCarouselToggle = this._buildActiveCarouselToggle();
        this._useCurrentLocationControl = this._buildUseCurrentLocationControl();
        this._setCurrentLocationControl = this._buildLocationSettingsControl();
        this._includeNighttimeWeatherToggle = this._buildNighttimeWeatherToggle();

        const settingsGrid = this._settingsPage.querySelector('.settings-grid');

        if (this._userDeniedGeolocation) {
            settingsGrid.appendChild(this._geolocationError);
        }

        settingsGrid.appendChild(this._search);
        settingsGrid.appendChild(this._map);
        settingsGrid.appendChild(this._locationInfo);
        settingsGrid.appendChild(this._extendedForecastToggle);
        settingsGrid.appendChild(this._includeNighttimeWeatherToggle);
        settingsGrid.appendChild(this._activeCarouselToggle);
        settingsGrid.appendChild(this._useCurrentLocationControl);
        settingsGrid.appendChild(this._setCurrentLocationControl);
    }

    private _buildActiveCarouselToggle(): HTMLElement {
        if (!this._clubs) {
            return new NotFoundTemplate('CLUBS_NOT_FOUND', this._ACTIVE_CAROUSEL_SETTING_ID).html;
        }

        const toggleState = this._settings.activeCarousel === 'club-list'
            ? 'on'
            : 'off';

        const [id, title, subTitle] = [
            this._ACTIVE_CAROUSEL_SETTING_ID,
            'View Clubs',
            '',
        ];

        const eventHandler = this._settingsPageEventHandlers.toggleActiveCarouselHandler;

        return new SettingsToggleTemplate(
            id,
            title,
            subTitle,
            toggleState,
            false,
            eventHandler
        ).html;
    }

    private _buildExtendedForecastToggle(): HTMLElement {
        const toggleState = this._settings.forecastDisplayMode === 'extended'
            ? 'on'
            : 'off';

        const [id, title, subTitle] = [
            this._FORECAST_DISPLAY_MODE_SETTING_ID,
            'Hourly Forecast',
            '',
        ];

        const eventHandler =  this._settingsPageEventHandlers.toggleForecastDisplayModeHandler;

        return new SettingsToggleTemplate(
            id,
            title,
            subTitle,
            toggleState,
            false,
            eventHandler
        ).html;
    }

    private _buildGeolocationError(): HTMLElement {
        return new GeolocationErrorTemplate().html;
    }

    private _buildNighttimeWeatherToggle(): HTMLElement {
        const toggleState = this._settings.includeNighttimeWeather
            ? 'on'
            : 'off';

        const [id, title, subTitle] = [
            this._INCLUDE_NIGHTTIME_WEATHER_SETTING_ID,
            'Include night-time weather',
            'Hourly Forecast only',
        ];

        const eventHandler =  this._settingsPageEventHandlers.toggleIncludeNighttimeWeatherHandler;
        const disabled = this._settings.forecastDisplayMode !== 'extended';

        return new SettingsToggleTemplate(
            id,
            title,
            subTitle,
            toggleState,
            disabled,
            eventHandler
        ).html;
    }

    private _buildLocationSettingsControl(): HTMLElement {
        if (!this._userLocation) {
            return new NotFoundTemplate('USER_LOCATION_NOT_FOUND', this._SET_CURRENT_LOCATION_SETTING_ID).html;
        }

        const eventHandler = this._settingsPageEventHandlers.toggleLocationSettingsHandler;

        return new LocationSettingsControlTemplate(eventHandler).html;
    }

    private _buildMap(): HTMLElement {
        if (!this._locationDetails.name) {
            return new NotFoundTemplate('COORDS_FOR_MAP_NOT_FOUND', this._GOOGLE_MAP_ID).html;
        }

        return new GoogleMapTemplate(this._googleMapsKey, this._locationDetails.coords).html;
    }

    private _buildLocationInfo(): HTMLElement {
        if (!this._locationDetails.name) {
            return new NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND', this._LOCATION_INFO_ID).html;
        }

        return new LocationInfoTemplate(this._locationDetails, this._LOCATION_INFO_ID).html;
    }

    private _buildLocationSearchInput(): HTMLElement {
        const eventHandler =  this._settingsPageEventHandlers.onLocationChangeHandler;

        return new SearchTemplate(
            this._LOCATION_SEARCH_INPUT_ID,
            'Location Search',
            'e.g. Perris, CA 92570, USA',
            false,
            eventHandler
        ).html;
    }

    private _buildUseCurrentLocationControl(): HTMLElement {
        if (!this._userLocation) {
            return new NotFoundTemplate('USER_LOCATION_NOT_FOUND', this._USE_CURRENT_LOCATION_SETTING_ID).html;
        }

        const eventHandler = this._settingsPageEventHandlers.getForecastForCurrentLocationHandler;

        return new UseCurrentLocationControlTemplate(this._userLocation, eventHandler).html;
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

    public get includeNighttimeWeatherToggle(): HTMLElement {
        return this._includeNighttimeWeatherToggle;
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
