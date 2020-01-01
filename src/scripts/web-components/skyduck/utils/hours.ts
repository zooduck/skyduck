import { HourlyData, DailyData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { DateTime } from 'luxon';

export class Hours {
    private _hourlyData: HourlyData[];
    private _sunrise: number;
    private _sunset: number;
    private _timezone: string;

    constructor(dailyData: DailyData, timezone: string) {
        const { hourly, sunriseTime, sunsetTime } = dailyData;
        this._hourlyData = hourly;
        this._sunrise = sunriseTime;
        this._sunset = sunsetTime;
        this._timezone = timezone;
    }

    get daylightHours(): HourlyData[] {
        return this._hourlyData.filter((hourlyItem) => {
            const hour = DateTime.fromSeconds(hourlyItem.time).setZone(this._timezone).hour;
            const sunriseHour = DateTime.fromSeconds(this._sunrise).setZone(this._timezone).hour;
            const sunsetHour = DateTime.fromSeconds(this._sunset).setZone(this._timezone).hour;

            return (hour > sunriseHour) && (hour < sunsetHour);
        });
    }
}
