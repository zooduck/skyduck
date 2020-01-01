import { HourlyData, ColorModifiersData, ColorModifiers, ColorModifier, DailyData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { weatherRatings } from '../utils/weather-ratings/weather-ratings';
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';
import { imageMap } from '../utils/image-map';
import { Hours } from '../utils/hours';

export class ForecastTemplate {
    private _defaultForecastHours: number[];
    private _forecast: HTMLElement;
    private _timezone: string;

    constructor(dayForecast: DailyData, defaultForecastHours: number[], timezone: string) {
        this._defaultForecastHours = defaultForecastHours;
        this._timezone = timezone;
        this._buildForecast(dayForecast);
    }

    private _buildForecast(dayForecast: DailyData): void {
        const {
            day,
            dateString,
            summary,
            sunriseTimeString,
            sunsetTime,
            sunsetTimeString,
            temperatureMin,
            temperatureMax,
            hourly,
        } = dayForecast;

        const defaultSummary = 'Partly potato with a chance of twilight sparkle.';

        const hours = hourly.map((hour: HourlyData, hourlyDataIndex: number) => {
            return this._buildForecastHour(hour, hourlyDataIndex);
        });

        const daylightHours = new Hours(dayForecast, this._timezone).daylightHours;
        const averageRatingModifier = averageRatingModifierForDay(daylightHours);
        const sunsetColorModifier = `--${weatherRatings.sunset(sunsetTime, this._timezone)}`;

        this._forecast = new DOMParser().parseFromString(`
            <div class="forecast-grid">
                <div class="forecast-grid-header ${averageRatingModifier}">
                    <div class="forecast-grid-header-date">
                        <h2>${day}</h2>
                        <h1 class="forecast-grid-header-date__date-string">${dateString}</h1>
                    </div>
                    <span class="forecast-grid-header__summary">${summary || defaultSummary}</span>
                    <div class="forecast-grid-header-sun-info">
                        <h3 class="forecast-grid-header-sun-info__item">Rise: ${sunriseTimeString}</h3>
                        <h3 class="forecast-grid-header-sun-info__item --sunset ${sunsetColorModifier}">Set: ${sunsetTimeString}</h3>
                    </div>
                    <div class="forecast-grid-header__temperature-summary">
                        <h2>${temperatureMin} - ${temperatureMax}&deg;</h2>
                    </div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        hours.forEach((hour: HTMLElement) => {
            this._forecast.appendChild(hour);
        });
    }

    private _buildForecastHour(hourlyData: HourlyData, hourlyDataIndex: number): HTMLElement {
        const {
            timeString,
            icon,
            summary,
            precipType,
            precipProbability,
            cloudCover,
            visibility,
            windSpeed,
            windGust,
        } = hourlyData;

        const weatherImagePath = imageMap[icon] || imageMap.default;
        const colorModifiers = this._getColorModifiers(hourlyData);

        const averageRatingModifier = averageRatingModifierForDay([hourlyData]);

        const isMode3h = this._defaultForecastHours.includes(parseInt(timeString, 10));
        const forecastDisplayModeModifier = isMode3h ? '--3h' : '--24h';

        const hourlyModeAnimationDelay = (hourlyDataIndex) * .10;
        const hourlyModeAnimationDelayStyle = `animation-delay: ${hourlyModeAnimationDelay}s;`;

        const forecastHour = new DOMParser().parseFromString(`
            <div class="forecast-grid-forecast ${forecastDisplayModeModifier}" style="${hourlyModeAnimationDelayStyle}">
                <div class="forecast-grid-forecast__weather-photo" style="background-image: url('${weatherImagePath}')"></div>

                <h2 class="forecast-grid-forecast__time ${averageRatingModifier}">
                    <span>${timeString}</span>
                </h2>

                <div class="forecast-grid-forecast-weather">
                    <h4 class="forecast-grid-forecast-weather__type">${summary || ''}</h4>
                </div>

                <div class="forecast-data-grid">
                    <div class="forecast-data-grid-type">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.cloudCover}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">cloud</span>
                    </div>
                    <div class="forecast-data-grid-type --landscape-only">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.visibility}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">vis</span>
                    </div>
                    <div class="forecast-data-grid-type --landscape-only">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.windSpeed}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">wind</span>
                    </div>
                    <div class="forecast-data-grid-type">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.windGust}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">gust</span>
                    </div>
                    <div class="forecast-data-grid-type">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.precipProbability}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">${precipType || 'rain'}</span>
                    </div>

                    <div class="forecast-data-grid__data ${colorModifiers.cloudCover}">${cloudCover}%</div>
                    <div class="forecast-data-grid__data ${colorModifiers.visibility} --landscape-only">${visibility}</div>
                    <div class="forecast-data-grid__data ${colorModifiers.windSpeed} --landscape-only">
                        <span>${windSpeed}</span>
                    </div>
                    <div class="forecast-data-grid__data ${colorModifiers.windGust}">
                        <span>${windGust}</span>
                    </div>
                    <div class="forecast-data-grid__data ${colorModifiers.precipProbability}">${precipProbability}%</div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return forecastHour;
    }

    private _getColorModifiers(colorModifiersData: ColorModifiersData): ColorModifiers {
        return {
            cloudCover: `--${weatherRatings.cloudCover(colorModifiersData.cloudCover)}` as ColorModifier,
            windSpeed: `--${weatherRatings.windSpeed(colorModifiersData.windSpeed)}` as ColorModifier,
            windGust: `--${weatherRatings.windGust(colorModifiersData.windGust)}` as ColorModifier,
            precipProbability: `--${weatherRatings.precipProbability(colorModifiersData.precipProbability)}` as ColorModifier,
            visibility: `--${weatherRatings.visibility(colorModifiersData.visibility)}` as ColorModifier,
        };
    }

    public get html(): HTMLElement {
        return this._forecast;

    }
}
