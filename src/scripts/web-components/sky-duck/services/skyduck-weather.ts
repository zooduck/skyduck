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
} from '../interfaces/index';
/* eslint-enable no-unused-vars */
import { darkSkyLookup } from '../fetch/dark-sky-lookup.fetch';
import { querySkydiveClub } from '../fetch/skydive-club.fetch';
import { dbWeatherLookup } from '../fetch/db-weather-lookup.fetch';
import { dbWeatherUpdate } from '../fetch/db-weather-update.fetch';
import { StateAPotamus } from '../state/stateapotamus';
import { findClub } from '../utils/find-club';

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
                dateString: this._getTZDateString(dailyItem.time, timezone),
                timeString: this._getTZTimeString(dailyItem.time, timezone),
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
                    const hourlyItemDate = this._getTZDateTime(hourlyItem.time, timezone);
                    const dailyItemDate = this._getTZDateTime(dailyItem.time, timezone);

                    return hourlyItemDate.hasSame(dailyItemDate, 'day');
                }).map((hourlyItem: HourlyData) => {
                    return this._formatHourlyData(hourlyItem, timezone);
                }),
            };
        });
    }

    private _formatHourlyData(hourlyData: HourlyData, timezone: string): any {
        return {
            ...hourlyData,
            dateString: this._getTZDateString(hourlyData.time, timezone),
            timeString: this._getTZTimeString(hourlyData.time, timezone),
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

        const { includeNighttimeWeather } = StateAPotamus.getState().settings;

        try {
            dbWeather = await dbWeatherLookup(latitude, longitude, includeNighttimeWeather);
        } catch (err) {
            // (400 or 404) continue...
        }

        if (!dbWeather || !dbWeather.isFresh) {
            const darkSkyData = await this._queryDarkSky(latitude, longitude, locationQuery);
            const { weather } = darkSkyData;

            try {
                await dbWeatherUpdate(weather);
                dbWeather = await dbWeatherLookup(latitude, longitude, includeNighttimeWeather);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        }

        return dbWeather;
    }

    private _getTZDateString(timeInSeconds: number, timezone: string): string {
        const tzTime = this._getTZDateTime(timeInSeconds, timezone);
        const parts = tzTime.toLocaleString(DateTime.DATE_SHORT).split('/').filter((_part, i: number) => {
            return i < 2;
        });

        return parts.join('/');
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
                requestTime: DateTime.local().toMillis(),
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
        const weather = await darkSkyLookup(lat, lon);

        if (!weather) {
            throw Error('Weather Service Unavailable');
        }

        return this._formatDarkSkyData(weather, query);
    }

    public async getDailyForecastByClub(name: string, clubList: SkydiveClub[]): Promise<DailyForecast> {
        let skydiveClub: SkydiveClub;

        if (clubList) {
            skydiveClub = findClub(clubList, name);
        } else {
            skydiveClub = await querySkydiveClub(name);
        }

        if (!skydiveClub) {
            throw Error(`Could not find club "${name}" in the skyduck database. Try searching by location instead.`);
        }

        const { latitude, longitude } = skydiveClub;

        const weather = await this._getDBWeather(latitude, longitude, name);

        if (!weather) {
            throw Error(`Unable to get forecast for club "${name}". Unknown Error.`);
        }

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
}
