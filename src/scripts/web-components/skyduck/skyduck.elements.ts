/* eslint-disable */
import { DailyForecast } from './interfaces/index';
import { HTMLZooduckCarouselElement } from '../zooduck-carousel/zooduck-carousel.component';
import { FooterTemplate } from './templates/footer.template';
import { ForecastCarouselTemplate } from './templates/forecast-carousel.template';
import { ForecastDisplayModeToggleTemplate } from './templates/forecast-display-mode-toggle.template';
import { HeaderTemplate } from './templates/header.template';
import { LocationInfoTemplate } from './templates/location-info.template';
import { SearchTemplate } from './templates/search.template';
/* eslint-enable */
export class SkyduckWeatherElements {
    private _dailyForecast: DailyForecast;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _googleMapsKey: string;
    private _defaultForecastHours: number[];
    private _version: string;

    constructor(
        dailyForecast: DailyForecast,
        googleMapsKey: string,
        version: string) {
        this._dailyForecast = dailyForecast;
        this._defaultForecastHours = [9, 12, 15];
        this._googleMapsKey = googleMapsKey;
        this._version = `v${version.split('-')[0]}`;
    }

    public get locationInfo(): HTMLElement {
        const {latitude, longitude, timezone }= this._dailyForecast.weather;
        const coords = {
            latitude,
            longitude,
        };
        const { countryRegion, club } = this._dailyForecast;

        return new LocationInfoTemplate(club, countryRegion, timezone, coords, this._googleMapsKey).html;
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
