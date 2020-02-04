import { DailyData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';
import { Hours } from '../utils/hours';
import { DaylightHoursIndicatorTemplate } from './daylight-hours-indicator.template';
import { StateAPotamus } from '../state/stateapotamus';

export class ForecastHeaderTemplate {
    private _dailyData: DailyData;
    private _forecastHeader: HTMLElement;
    private _timezone: string;

    constructor() {
        const { currentForecastSlide, forecast } = StateAPotamus.getState();

        this._dailyData = forecast.weather.daily.data[currentForecastSlide - 1];
        this._timezone = forecast.weather.timezone;

        this._buildForecastHeader();
    }

    private _buildDaylightHoursIndicator(): HTMLElement {
        const { currentForecastSlide, forecast } = StateAPotamus.getState();
        const { daily, timezone } = forecast.weather;
        const { sunriseTime, sunriseTimeString, sunsetTime, sunsetTimeString } = daily.data[currentForecastSlide - 1];

        return new DaylightHoursIndicatorTemplate(
            sunriseTime,
            sunriseTimeString,
            sunsetTime,
            sunsetTimeString,
            timezone
        ).html;
    }

    private _buildForecastHeader(): void {
        const {
            day,
            dateString,
            summary,
            temperatureMin,
            temperatureMax,
        } = this._dailyData;

        const defaultSummary = 'Partly potato with a chance of twilight sparkle in the evening.';
        const daylightHours = new Hours(this._dailyData, this._timezone).daylightHours;
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
