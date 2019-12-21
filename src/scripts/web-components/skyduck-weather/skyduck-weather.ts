import { graphqlConfig } from '../../config/graphql.config';
import { darkSkyQuery } from './graphql-queries/dark-sky-query';
import { DateTime } from 'luxon';
import { DailyForecast, GeocodeData, HourlyData, SkydiveClub, DailyData } from './interfaces/index'; // eslint-disable-line no-unused-vars
import { skydiveClubQuery } from './graphql-queries/skydive-club-query';

export class SkyduckWeather {
    private _dailyData: any;
    private _skydiveClub: SkydiveClub;

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

    public async getDailyForecastByClub(name: string): Promise<DailyForecast> {
        const skydiveClub: SkydiveClub = await this._querySkydiveClub(name);

        if (!skydiveClub) {
            throw Error(`Could not find club "${name}" in the skyduck database. Try searching by location instead.`);
        }

        this._skydiveClub = skydiveClub;

        const dbWeatherResult = await this._queryDatabase(skydiveClub.id);
        const oneHourAgo = DateTime.local().minus({ hours: 1 }).toMillis();

        if (dbWeatherResult.error || dbWeatherResult.requestTime < oneHourAgo) {
            const darkSkyData = await this._queryDarkSky(skydiveClub.latitude, skydiveClub.longitude, name);
            const method = dbWeatherResult.error ? 'POST' : 'PUT';
            const dbWeatherUpdate = await this._updateWeatherDatabase(darkSkyData, method);
            const dbWeatherUpdateResult = await dbWeatherUpdate.json();

            return {
                query: darkSkyData.query,
                club: darkSkyData.club,
                weather: {
                    ...dbWeatherUpdateResult,
                }
            };
        }

        return {
            query: name,
            club: this._skydiveClub,
            weather: {
                ...dbWeatherResult,
            }
        };

    }

    public async getDailyForecastByQuery(geocodeData: GeocodeData): Promise<DailyForecast> {
        const { name, latitude, longitude, locationQuery } = geocodeData;
        const { countryRegion } = geocodeData.address;

        const place = name.includes(countryRegion)
            ? name
            : `${name}, ${countryRegion}`;

        this._skydiveClub = {
            id: '',
            name: '',
            place,
            country: '',
            latitude,
            longitude,
            site: '',
        };

        const darkSkyData = await this._queryDarkSky(latitude, longitude, locationQuery);

        return {
            query: darkSkyData.query,
            club: darkSkyData.club,
            weather: darkSkyData.weather,
            countryRegion: geocodeData.address.countryRegion,
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

    private async _queryDarkSky(lat: number, lon: number, query: string): Promise<DailyForecast> {
        try {
            const graphqlResult = await fetch(graphqlConfig.uri, {
                ...graphqlConfig.options,
                body: JSON.stringify({
                    query: darkSkyQuery,
                    variables: {
                        lat,
                        lon,
                    },
                }),
            });

            const json = await graphqlResult.json();

            const {
                daily: rawDailyData,
                hourly: rawHourlyData,
                timezone
            } = json.data.weather;

            this._dailyData = this._formatDailyData(rawDailyData.data, rawHourlyData.data, timezone);

            return {
                query,
                club: this._skydiveClub,
                weather: {
                    latitude: json.data.weather.latitude,
                    longitude: json.data.weather.longitude,
                    timezone: json.data.weather.timezone,
                    daily: {
                        summary: json.data.weather.daily.summary,
                        icon: json.data.weather.daily.icon,
                        data: this._dailyData,
                    },
                    requestTime: new Date().getTime(),
                }
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    private async _queryDatabase(clubId: string): Promise<DailyForecast|any> {
        const dbWeatherQuery = await fetch(`/weather?id=${clubId}`);
        const dbWeatherResult = await dbWeatherQuery.json();

        return dbWeatherResult;
    }

    private async _querySkydiveClub(name: string): Promise<SkydiveClub> {
        try {
            const graphqlResult = await fetch(graphqlConfig.uri, {
                ...graphqlConfig.options,
                body: JSON.stringify({
                    query: skydiveClubQuery,
                    variables: {
                        name,
                    },
                }),
            });

            const json = await graphqlResult.json();

            return json.data.club;
        } catch (err) {
            throw new Error(err);
        }
    }

    private _roundHour(dt: DateTime): number {
        const decimalMinute = dt.minute / 60;
        const decimalHour = dt.hour + decimalMinute;

        return Math.round(decimalHour);
    }

    private async _updateWeatherDatabase(darkSkyData: DailyForecast, method: 'POST'|'PUT'): Promise<any> {
        const result = await fetch('/weather', {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...darkSkyData.club,
                ...darkSkyData.weather,
                requestTime: new Date().getTime(),
            }),
        });

        if (!result.ok) {
            throw new Error(`${result.status} (${result.statusText})`);
        }

        return result;
    }
}
