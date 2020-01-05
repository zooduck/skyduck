/* eslint-disable */
import { DailyForecast, LocationDetails, HTMLZooduckCarouselElement, ClubListsSortedByCountry, SkydiveClub, MapDisplayMode, ForecastDisplayMode } from './interfaces/index';
import { FooterTemplate } from './templates/footer.template';
import { ForecastCarouselTemplate } from './templates/forecast-carousel.template';
import { ControlsTemplate } from './templates/controls.template';
import { HeaderTemplate } from './templates/header.template';
import { LocationInfoTemplate } from './templates/location-info.template';
import { SearchTemplate } from './templates/search.template';
import { ClubListCarouselTemplate } from './templates/club-list-carousel.template';
import { GeolocationErrorTemplate } from './templates/geolocation-error.template';
import { NotFoundTemplate } from './templates/not-found.template';
/* eslint-enable */

export class SkyduckWeatherElements {
    private _dailyForecast: DailyForecast;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _forecastDisplayMode: ForecastDisplayMode;
    private _googleMapsKey: string;
    private _hasClubList: boolean;
    private _hasForecast: boolean;
    private _locationDetails: LocationDetails;
    private _mapDisplayMode: MapDisplayMode;
    private _defaultForecastHours: number[];
    private _version: string;
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _nearestClub: SkydiveClub;
    private _position: Position;
    private _userDeniedGeolocation: boolean;

    constructor(
        locationDetails: LocationDetails,
        dailyForecast: DailyForecast,
        googleMapsKey: string,
        version: string,
        clubsSortedByCountry: ClubListsSortedByCountry,
        nearestClub: SkydiveClub,
        position: Position,
        userDeniedGeolocation: boolean,
        forecastDisplayMode: ForecastDisplayMode,
        mapDisplayMode: MapDisplayMode) {
        this._dailyForecast = dailyForecast;
        this._defaultForecastHours = [9, 12, 15];
        this._forecastDisplayMode = forecastDisplayMode;
        this._googleMapsKey = googleMapsKey;
        this._hasClubList = Object.keys(clubsSortedByCountry).length > 0;
        this._hasForecast = this._dailyForecast !== undefined;
        this._locationDetails = locationDetails;
        this._mapDisplayMode = mapDisplayMode;
        this._version = version ? `v${version.split('-')[0]}` : '';
        this._clubsSortedByCountry = clubsSortedByCountry;
        this._nearestClub = nearestClub;
        this._position = position;
        this._userDeniedGeolocation = userDeniedGeolocation;
    }

    public get clubList(): HTMLElement {
        if (!this._hasClubList) {
            return new NotFoundTemplate('CLUBS_NOT_FOUND').html;
        }

        return new ClubListCarouselTemplate(this._clubsSortedByCountry, this._nearestClub, this._position).html;
    }

    public get geolocationError(): HTMLElement {
        return new GeolocationErrorTemplate().html;
    }

    public get locationInfo(): HTMLElement {
        return new LocationInfoTemplate(this._locationDetails, this._googleMapsKey).html;
    }

    public get footer(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate('FORECAST_NOT_FOUND').html;
        }

        const { requestTime } = this._dailyForecast.weather;

        return new FooterTemplate(requestTime).html;
    }

    public get forecast(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate('FORECAST_NOT_FOUND').html;
        }

        const { daily, timezone } = this._dailyForecast.weather;
        this._forecastCarousel = new ForecastCarouselTemplate(daily.data, this._defaultForecastHours, timezone, this._locationDetails).html;

        return this._forecastCarousel;
    }

    public get controls(): HTMLElement {
        return new ControlsTemplate(this._mapDisplayMode, this._forecastDisplayMode, this._hasClubList, this._hasForecast).html;
    }

    public get header(): HTMLElement {
        return new HeaderTemplate(this._version, this._userDeniedGeolocation).html;
    }

    public get search(): HTMLElement {
        return new SearchTemplate().html;
    }
}
