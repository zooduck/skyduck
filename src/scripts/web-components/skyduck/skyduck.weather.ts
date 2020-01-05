import { DateTime } from 'luxon';
/* eslint-disable no-unused-vars */
import {
    DailyForecast,
    GeocodeData,
    HourlyData,
    SkydiveClub,
    DailyData,
    DarkSkyWeather,
    FormattedWeather,
} from './interfaces/index';
/* eslint-enable no-unused-vars */
import { darkSkyLookup } from './fetch/dark-sky-lookup.fetch';
import { querySkydiveClub } from './fetch/skydive-club.fetch';
import { dbWeatherLookup } from './fetch/db-weather-lookup.fetch';
import { dbWeatherUpdate } from './fetch/db-weather-update.fetch';
import { escapeSpecialChars } from './utils/escape-special-chars';

export class SkyduckWeather {
    private _floatToInt(float: number): number {
        return parseInt(float.toString(), 10);
    }

    private _fractionToPercent(fraction: number): number {
        return parseInt((fraction * 100).toString(), 10);
    }

    private _formatDailyData(dailyData: DailyData[], hourlyData: HourlyData[], timezone: string): any {
        return dailyData.map((dailyItem: any) => {
            return {
                ...dailyItem,
                dateString: this._getTZDateString(dailyItem.time, timezone).substr(0, 5),
                timeString: this._getTZTimeString(dailyItem.time, timezone).substr(0, 2),
                sunriseTimeString: this._getTZTimeString(dailyItem.sunriseTime, timezone),
                sunsetTimeString: this._getTZTimeString(dailyItem.sunsetTime, timezone),
                day: this._getTZDateTime(dailyItem.time, timezone).weekdayShort,
                cloudCover: this._fractionToPercent(dailyItem.cloudCover),
                precipProbability: this._fractionToPercent(dailyItem.precipProbability),
                temperatureMin: this._floatToInt(dailyItem.temperatureMin),
                temperatureMax: this._floatToInt(dailyItem.temperatureMax),
                temperatureAverage: this._floatToInt((dailyItem.temperatureMax + dailyItem.temperatureMin) / 2),
                apparentTemperatureMin: this._floatToInt(dailyItem.apparentTemperatureMin),
                apparentTemperatureMax: this._floatToInt(dailyItem.apparentTemperatureMax),
                apparentTemperatureAverage: this._floatToInt((dailyItem.apparentTemperatureMax + dailyItem.apparentTemperatureMin) / 2),
                humidity: this._fractionToPercent(dailyItem.humidity),
                windGust: this._floatToInt(dailyItem.windGust),
                windSpeed: this._floatToInt(dailyItem.windSpeed),
                visibility: this._floatToInt(dailyItem.visibility),
                hourly: hourlyData.filter((hourlyItem: HourlyData) => {
                    // Include hourly data from 2 hours before sunrise until 2 hours after sunset
                    const hourlyItemDate = this._getTZDateString(hourlyItem.time, timezone);
                    const dailyItemDate = this._getTZDateString(dailyItem.time, timezone);
                    const hourlyItemHour = this._getTZDateTime(hourlyItem.time, timezone).hour;
                    const sunriseHour = this._roundHour(this._getTZDateTime(dailyItem.sunriseTime, timezone));
                    const sunsetHour = this._roundHour(this._getTZDateTime(dailyItem.sunsetTime, timezone));
                    const requiredHoursBeforeSunrise = sunriseHour - 2;
                    const requiredHoursAfterSunset = sunsetHour + 2;

                    return hourlyItemDate === dailyItemDate
                        && hourlyItemHour >= requiredHoursBeforeSunrise
                        && hourlyItemHour <= requiredHoursAfterSunset;
                }).map((hourlyItem: HourlyData) => {
                    return this._formatHourlyData(hourlyItem, timezone);
                }),
            };
        });
    }

    private _formatHourlyData(hourlyData: HourlyData, timezone: string): any {
        return {
            ...hourlyData,
            dateString: this._getTZDateString(hourlyData.time, timezone).substr(0, 5),
            timeString: this._getTZTimeString(hourlyData.time, timezone).substr(0, 2),
            day: this._getTZDateTime(hourlyData.time, timezone).weekdayShort,
            cloudCover: this._fractionToPercent(hourlyData.cloudCover),
            precipProbability: this._fractionToPercent(hourlyData.precipProbability),
            temperature: this._floatToInt(hourlyData.temperature),
            apparentTemperature: this._floatToInt(hourlyData.apparentTemperature),
            humidity: this._fractionToPercent(hourlyData.humidity),
            windGust: this._floatToInt(hourlyData.windGust),
            windSpeed: this._floatToInt(hourlyData.windSpeed),
            visibility:  this._floatToInt(hourlyData.visibility),
        };
    }

    private async _getDBWeather(latitude: number, longitude: number, locationQuery: string): Promise<FormattedWeather> {
        let dbWeather: FormattedWeather;

        try {
            dbWeather = await dbWeatherLookup(latitude, longitude);

        } catch (err) {
            // do nothing
        }

        if (!dbWeather || !dbWeather.isFresh) {
            const darkSkyData = await this._queryDarkSky(latitude, longitude, locationQuery);
            const method = !dbWeather ? 'POST' : 'PUT';

            dbWeather = await dbWeatherUpdate(darkSkyData.weather, method);
        }

        return dbWeather;
    }

    public async getDailyForecastByClub(name: string, clubList: SkydiveClub[]): Promise<DailyForecast> {
        let skydiveClub: SkydiveClub;

        if (clubList) {
            const clubEscaped = escapeSpecialChars(name);

            skydiveClub = clubList.find((club: SkydiveClub) => {
                return new RegExp(clubEscaped, 'i').test(club.name);
            });
        } else {
            skydiveClub = await querySkydiveClub(name);
        }

        if (!skydiveClub) {
            throw Error(`Could not find club "${name}" in the skyduck database. Try searching by location instead.`);
        }

        const { latitude,longitude } = skydiveClub;

        const weather = await this._getDBWeather(latitude, longitude, name);

        return {
            weather,
        };
    }

    public async getDailyForecastByQuery(geocodeData: GeocodeData): Promise<DailyForecast> {
        const { latitude, longitude, query } = geocodeData;
        const { countryRegion, formattedAddress } = geocodeData.address;

        const weather = await this._getDBWeather(latitude, longitude, query);

        return {
            weather,
            countryRegion,
            formattedAddress,
        };
    }

    private _getTZDateString(timeInSeconds: number, timezone: string): string {
        const tzTime = this._getTZDateTime(timeInSeconds, timezone);

        return tzTime.toLocaleString(DateTime.DATE_SHORT);
    }

    private _getTZDateTime(timeInSeconds: number, timezone: string): DateTime {
        const localTime = DateTime.fromSeconds(timeInSeconds || 0);
        const tzTime = localTime.setZone(timezone);

        return tzTime;
    }

    private _getTZTimeString(timeInSeconds: number, timezone: string): string {
        const tzTime = this._getTZDateTime(timeInSeconds, timezone);

        return tzTime.toLocaleString(DateTime.TIME_24_SIMPLE);
    }

    private _formatDarkSkyData(weather: DarkSkyWeather, query: string): DailyForecast {
        const { latitude, longitude, timezone, daily, hourly } = weather;

        return {
            weather: {
                query,
                requestTime: new Date().getTime(),
                latitude,
                longitude,
                timezone,
                daily: {
                    summary: daily.summary,
                    icon: daily.icon,
                    data: this._formatDailyData(daily.data, hourly.data, timezone),
                },
            }
        };
    }

    private async _queryDarkSky(lat: number, lon: number, query: string): Promise<DailyForecast> {
        try {
            const weather = await darkSkyLookup(lat, lon);

            return this._formatDarkSkyData(weather, query);
        } catch (err) {
            throw new Error(err);
        }
    }

    private _roundHour(dt: DateTime): number {
        const decimalMinute = dt.minute / 60;
        const decimalHour = dt.hour + decimalMinute;

        return Math.round(decimalHour);
    }
}
