/* eslint-disable */
import {
    DailyForecast,
    LocationDetails,
    HTMLZooduckCarouselElement,
    ClubListsSortedByCountry,
    ClubCountries,
    GeocodeData,
    EventHandlers,
} from '../interfaces/index';
import { FooterTemplate } from '../templates/footer.template';
import { ForecastCarouselTemplate } from '../templates/forecast-carousel.template';
import { HeaderTemplate } from '../templates/header.template';
import { ClubListCarouselTemplate } from '../templates/club-list-carousel.template';
import { NotFoundTemplate } from '../templates/not-found.template';
import { HeaderPlaceholderTemplate } from '../templates/header-placeholder.template';
import { StateAPotamus } from '../state/stateapotamus';
import { ForecastHeaderTemplate } from '../templates/forecast-header.template';
/* eslint-enable */

export class SkyduckElements {
    private _CLUBS_NOT_FOUND = 'CLUBS_NOT_FOUND';
    private _FORECAST_NOT_FOUND = 'FORECAST_NOT_FOUND';
    private _clubCountries: ClubCountries;
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _currentForecastSlide: number;
    private _dailyForecast: DailyForecast;
    private _eventHandlers: EventHandlers;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _forecastHours: number[];
    private _forecastHoursExtended: number[];
    private _hasClubList: boolean;
    private _locationDetails: LocationDetails;
    private _version: string;
    private _userLocation: GeocodeData;

    constructor(eventHandlers: EventHandlers) {
        const {
            clubCountries,
            clubsSortedByCountry,
            currentForecastSlide,
            forecast: dailyForecast,
            locationDetails,
            userLocation,
            version,
        } = StateAPotamus.getState();

        this._currentForecastSlide = currentForecastSlide;
        this._dailyForecast = dailyForecast;
        this._forecastHours = [9, 12, 15];
        this._forecastHoursExtended = Array.from({ length: 24 }).map((_item, i) => i);
        this._hasClubList = clubsSortedByCountry && Object.keys(clubsSortedByCountry).length > 0;
        this._locationDetails = locationDetails;
        this._version = version;
        this._clubsSortedByCountry = clubsSortedByCountry;
        this._clubCountries = clubCountries;
        this._userLocation = userLocation;
        this._eventHandlers = eventHandlers;
    }

    public get clubList(): HTMLElement {
        if (!this._hasClubList) {
            return new NotFoundTemplate(this._CLUBS_NOT_FOUND).html;
        }

        return new ClubListCarouselTemplate(
            this._clubsSortedByCountry,
            this._clubCountries,
            this._userLocation,
            this._eventHandlers.onClubListCarouselSlideChangeHandler,
            this._eventHandlers.onClubChangeHandler,
        ).html;
    }

    public get footer(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate(this._FORECAST_NOT_FOUND).html;
        }

        const { requestTime } = this._dailyForecast.weather;

        return new FooterTemplate(requestTime).html;
    }

    public get forecast(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate(this._FORECAST_NOT_FOUND).html;
        }

        const { data: dailyData } = this._dailyForecast.weather.daily;
        this._forecastCarousel = new ForecastCarouselTemplate(
            dailyData,
            this._forecastHours,
            'standard',
            this._currentForecastSlide,
            this._eventHandlers.onForecastCarouselSlideChangeHandler,
        ).html;

        return this._forecastCarousel;
    }

    public get forecastExtended(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate(this._FORECAST_NOT_FOUND).html;
        }

        const { data: dailyData } = this._dailyForecast.weather.daily;
        this._forecastCarousel = new ForecastCarouselTemplate(
            dailyData,
            this._forecastHoursExtended,
            'extended',
            this._currentForecastSlide,
            this._eventHandlers.onForecastCarouselSlideChangeHandler,
        ).html;

        return this._forecastCarousel;
    }

    public get forecastHeader(): HTMLElement {
        if (!this._dailyForecast) {
            return new NotFoundTemplate(this._FORECAST_NOT_FOUND, 'forecastHeader', '--render-once').html;
        }

        return new ForecastHeaderTemplate().html;
    }

    public get header(): HTMLElement {
        return new HeaderTemplate(
            this._version,
            this._locationDetails.name,
            this._locationDetails.address,
            this._eventHandlers.toggleSettingsHandler
        ).html;
    }

    public get headerPlaceholder(): HTMLElement {
        return new HeaderPlaceholderTemplate().html;
    }
}
