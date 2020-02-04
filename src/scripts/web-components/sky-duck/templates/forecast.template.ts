import { HourlyData, DailyData, ForecastType } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { ForecastHourTemplate } from './forecast-hour.template';
import { DateTime, Interval } from 'luxon';

export class ForecastTemplate {
    private _dayForecast: DailyData;
    private _forecastHours: number[];
    private _forecast: HTMLElement;
    private _forecastType: ForecastType;

    constructor(dayForecast: DailyData, forecastHours: number[], forecastType: ForecastType) {
        this._dayForecast = dayForecast;
        this._forecastHours = forecastHours;
        this._forecastType = forecastType;

        this._buildForecast();
    }

    private _buildForecast(): void {
        const {
            sunriseTime,
            sunsetTime,
            hourly,
        } = this._dayForecast;

        const hourlyData = hourly.filter((hour: HourlyData) => {
            return this._forecastHours.includes((parseInt(hour.timeString, 10)));
        });

        const hours = hourlyData.map((hour: HourlyData) => {
            const isDaylight = this._isDaylight(sunriseTime, sunsetTime, hour.time);

            return new ForecastHourTemplate(hour, isDaylight).html;
        });

        const modifierClass = `--${this._forecastType}`;

        this._forecast = new DOMParser().parseFromString(`
            <div class="forecast-grid ${modifierClass}">
                <div class="forecast-grid-hours"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        const forecastGridHours = this._forecast.querySelector('.forecast-grid-hours');

        hours.forEach((hour: HTMLElement) => {
            forecastGridHours.appendChild(hour);
        });
    }

    private _isDaylight(sunriseTimeInSeconds: number, sunsetTimeInSeconds: number, timeInSeconds: number): boolean {
        const sunriseDT = DateTime.fromSeconds(sunriseTimeInSeconds);
        const sunsetDT = DateTime.fromSeconds(sunsetTimeInSeconds);
        const dt = DateTime.fromSeconds(timeInSeconds);
        const daylightInterval = Interval.fromDateTimes(sunriseDT, sunsetDT);

        return !daylightInterval.isBefore(dt) && !daylightInterval.isAfter(dt);
    }

    public get html(): HTMLElement {
        return this._forecast;
    }
}
