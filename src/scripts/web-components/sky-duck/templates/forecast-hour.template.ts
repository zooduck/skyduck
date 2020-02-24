import { HourlyData, ColorModifiersData, ColorModifiers, ColorModifier } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { imageMap } from '../utils/image-map';
import { weatherRatings } from '../utils/weather-ratings/weather-ratings';
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';

export class ForecastHourTemplate {
    private _forecastHour: HTMLElement;
    private _hourlyData: HourlyData;
    private _isDaylight: boolean;

    constructor(hourlyData: HourlyData, isDaylight: boolean) {
        this._hourlyData = hourlyData;
        this._isDaylight = isDaylight;

        this._buildForecastHour();
    }

    private _buildForecastHour(): void {
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
        } = this._hourlyData;

        const weatherImagePath = imageMap[icon] || imageMap.default;
        const colorModifiers = this._getColorModifiers(this._hourlyData);

        const averageRatingModifier = averageRatingModifierForDay([this._hourlyData]);
        const notDaylightModifier = !this._isDaylight
            ? '--not-daylight'
            : '';

        const weatherPhotoStyle = `
            background-image: url('${weatherImagePath}');
        `;

        this._forecastHour = new DOMParser().parseFromString(`
            <div class="forecast-grid-hour ${notDaylightModifier}">
                <div class="forecast-grid-hour__not-daylight-mesh"></div>
                <div class="forecast-grid-hour__photo" style="${weatherPhotoStyle}"></div>

                <h2 class="forecast-grid-hour-time-container">
                    <span class="forecast-grid-hour-time-container__time ${averageRatingModifier}">${timeString.split(':')[0]}</span>
                </h2>

                ${this._buildForecastHourSummary(summary)}

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
                    <div class="forecast-data-grid-type">
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
                    <div class="forecast-data-grid-type --landscape-only">
                        <zooduck-icon-circle
                            size="22"
                            class="forecast-data-grid-type__icon ${colorModifiers.precipProbability}">
                        </zooduck-icon-circle>
                        <span class="forecast-data-grid-type__text">${precipType || 'rain'}</span>
                    </div>

                    <div class="forecast-data-grid__data ${colorModifiers.cloudCover}">${cloudCover}%</div>
                    <div class="forecast-data-grid__data ${colorModifiers.visibility} --landscape-only">${visibility}</div>
                    <div class="forecast-data-grid__data ${colorModifiers.windSpeed}">
                        <span>${windSpeed}</span>
                    </div>
                    <div class="forecast-data-grid__data ${colorModifiers.windGust}">
                        <span>${windGust}</span>
                    </div>
                    <div class="forecast-data-grid__data ${colorModifiers.precipProbability} --landscape-only">${precipProbability}%</div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    private _buildForecastHourSummary(summary: string): string {
        const wordsInSummary = summary.split(' ');

        if (!summary || wordsInSummary.length < 3) {
            return `<h4 class="forecast-grid-hour__summary">${summary}</h4>`;
        }

        return `<h5 class="forecast-grid-hour__summary">${summary}</h5>`;
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
        return this._forecastHour;
    }
}
