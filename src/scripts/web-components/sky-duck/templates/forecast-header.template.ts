import { DailyData, DailyForecast } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';
import { Hours } from '../utils/hours';
import { DaylightHoursIndicatorTemplate } from './daylight-hours-indicator.template';
import { StateAPotamus } from '../state/stateapotamus';

export class ForecastHeaderTemplate {
    private _currentForecastSlide: number;
    private _forecast: DailyForecast;
    private _forecastHeader: HTMLElement;

    constructor() {
        const { currentForecastSlide, forecast } = StateAPotamus.getState();

        this._currentForecastSlide = currentForecastSlide;
        this._forecast = forecast;

        this._buildForecastHeader();
    }

    private _buildDaylightHoursIndicator(): HTMLElement {
        const { daily, timezone } = this._forecast.weather;
        const { sunriseTime, sunriseTimeString, sunsetTime, sunsetTimeString } = daily.data[this._currentForecastSlide - 1];

        return new DaylightHoursIndicatorTemplate(
            sunriseTime,
            sunriseTimeString,
            sunsetTime,
            sunsetTimeString,
            timezone
        ).html;
    }

    private _buildForecastHeader(): void {
        const dailyData = this._forecast.weather.daily.data[this._currentForecastSlide - 1];
        const timezone = this._forecast.weather.timezone;

        const {
            day,
            dateString,
            summary,
            temperatureMin,
            temperatureMax,
        } = dailyData;

        const defaultSummary = 'Partly potato with a chance of twilight sparkle in the evening.';
        const daylightHours = new Hours(dailyData, timezone).daylightHours;
        const averageRatingModifier = averageRatingModifierForDay(daylightHours);

        this._forecastHeader = new DOMParser().parseFromString(`
            <div
                id="forecastHeader"
                class="forecast-header --render-once">
                <div class="forecast-header-info-grid ${averageRatingModifier}">
                    <div class="forecast-header-info-grid-date">
                        <h2 class="forecast-header-info-grid-date__day">${day}</h2>
                        <h1 class="forecast-header-info-grid-date__date-string">${dateString}</h1>
                    </div>
                    <div class="forecast-header-info-grid__temp">
                        <h3>${temperatureMin} / ${temperatureMax}&deg;</h3>
                    </div>
                    <div class="forecast-header-info-grid__summary">${summary || defaultSummary}</div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._forecastHeader.appendChild(this._buildDaylightHoursIndicator());
    }

    public get html(): HTMLElement {
        return this._forecastHeader;
    }
}
