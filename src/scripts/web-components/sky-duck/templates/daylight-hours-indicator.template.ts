import { DateTime, Interval } from 'luxon';

export class DaylightHoursIndicatorTemplate {
    private _daylightHoursIndicator: HTMLElement;
    private _sunriseTime: number;
    private _sunriseTimeString: string;
    private _sunsetTime: number;
    private _sunsetTimeString: string;
    private _timezone: string;

    constructor(
        sunriseTime: number,
        sunriseTimeString: string,
        sunsetTime: number,
        sunsetTimeString: string,
        timezone: string) {
        this._sunriseTime = sunriseTime;
        this._sunriseTimeString = sunriseTimeString;
        this._sunsetTime = sunsetTime;
        this._sunsetTimeString = sunsetTimeString;
        this._timezone = timezone;

        this._buildDaylightHoursIndicator();
    }

    private _getStyle(): string {
        const minutesPerDay = 60 * 24;
        const sunriseDt = DateTime.fromSeconds(this._sunriseTime).setZone(this._timezone);
        const sunsetDt = DateTime.fromSeconds(this._sunsetTime).setZone(this._timezone);
        const sunriseToSunsetInterval = Interval.fromDateTimes(sunriseDt, sunsetDt);
        const daylightMinutes = sunriseToSunsetInterval.length('minutes');
        const daylightMinutesFraction = (daylightMinutes / minutesPerDay);

        return `grid-template-columns: auto ${daylightMinutesFraction}fr auto;`;
    }

    private _buildDaylightHoursIndicator(): void {
        this._daylightHoursIndicator = new DOMParser().parseFromString(`
            <div
                class="daylight-hours-indicator"
                style="${this._getStyle()}">
                <h3 class="daylight-hours-indicator__section --sunrise">${this._sunriseTimeString}</h3>
                <div class="daylight-hours-indicator__daylight"></div>
                <h3 class="daylight-hours-indicator__section --sunset">${this._sunsetTimeString}</h3>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._daylightHoursIndicator;
    }
}
