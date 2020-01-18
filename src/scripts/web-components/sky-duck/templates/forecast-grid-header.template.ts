import { DailyData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';
import { Hours } from '../utils/hours';

export class ForecastGridHeaderTemplate {
    private _dayForecast: DailyData;
    private _forecastGridHeader: HTMLElement;
    private _timezone: string;

    constructor(dayForecast: DailyData, timezone: string) {
        this._dayForecast = dayForecast;
        this._timezone = timezone;

        this._buildForecastGridHeader();
    }

    private _buildForecastGridHeader(): void {
        const {
            day,
            dateString,
            summary,
            temperatureMin,
            temperatureMax,
        } = this._dayForecast;

        const defaultSummary = 'Partly potato with a chance of twilight sparkle in the evening.';
        const daylightHours = new Hours(this._dayForecast, this._timezone).daylightHours;
        const averageRatingModifier = averageRatingModifierForDay(daylightHours);

        this._forecastGridHeader = new DOMParser().parseFromString(`
            <div class="forecast-grid-header ${averageRatingModifier}">
                <div class="forecast-grid-header-date">
                    <h2 class="forecast-grid-header-date__day">${day}</h2>
                    <h1 class="forecast-grid-header-date__date-string">${dateString}</h1>
                </div>
                <div class="forecast-grid-header__temp">
                    <h3>${temperatureMin} / ${temperatureMax}&deg;</h3>
                </div>
                <div class="forecast-grid-header__summary">${summary || defaultSummary}</div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._forecastGridHeader;
    }
}
