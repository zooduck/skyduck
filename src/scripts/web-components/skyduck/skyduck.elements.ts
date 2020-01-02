/* eslint-disable */
import { DailyForecast, LocationDetails, HTMLZooduckCarouselElement, ClubListsSortedByCountry, SkydiveClub } from './interfaces/index';
import { FooterTemplate } from './templates/footer.template';
import { ForecastCarouselTemplate } from './templates/forecast-carousel.template';
import { ForecastDisplayModeToggleTemplate } from './templates/forecast-display-mode-toggle.template';
import { HeaderTemplate } from './templates/header.template';
import { LocationInfoTemplate } from './templates/location-info.template';
import { SearchTemplate } from './templates/search.template';
import { ClubListCarouselTemplate } from './templates/club-list-carousel.template';
/* eslint-enable */

export class SkyduckWeatherElements {
    private _dailyForecast: DailyForecast;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _googleMapsKey: string;
    private _locationDetails: LocationDetails;
    private _defaultForecastHours: number[];
    private _version: string;
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _nearestClub: SkydiveClub;
    private _position: Position;

    constructor(
        locationDetails: LocationDetails,
        dailyForecast: DailyForecast,
        googleMapsKey: string,
        version: string,
        clubsSortedByCountry: ClubListsSortedByCountry,
        nearestClub: SkydiveClub,
        position: Position) {
        this._dailyForecast = dailyForecast;
        this._defaultForecastHours = [9, 12, 15];
        this._googleMapsKey = googleMapsKey;
        this._locationDetails = locationDetails;
        this._version = `v${version.split('-')[0]}`;
        this._clubsSortedByCountry = clubsSortedByCountry;
        this._nearestClub = nearestClub;
        this._position = position;
    }

    public get clubList(): HTMLElement {
        return new ClubListCarouselTemplate(this._clubsSortedByCountry, this._nearestClub, this._position).html;
    }

    public get locationInfo(): HTMLElement {
        return new LocationInfoTemplate(this._locationDetails, this._googleMapsKey).html;
    }

    public get footer(): HTMLElement {
        const { requestTime } = this._dailyForecast.weather;

        return new FooterTemplate(requestTime).html;
    }

    public get forecast(): HTMLElement {
        const { daily, timezone } = this._dailyForecast.weather;
        this._forecastCarousel = new ForecastCarouselTemplate(daily.data, this._defaultForecastHours, timezone).html;

        return this._forecastCarousel;
    }

    public get forecastDisplayModeToggle(): HTMLElement {
        return new ForecastDisplayModeToggleTemplate().html;
    }

    public get header(): HTMLElement {
        return new HeaderTemplate(this._version).html;
    }

    public get search(): HTMLElement {
        return new SearchTemplate().html;
    }
}
