import { DateTime } from 'luxon';
import { weatherRatings } from './utils/weather-ratings/weather-ratings';
import '../zooduck-carousel/zooduck-carousel.component';
/* eslint-disable */
import {
    HourlyData,
    ColorModifier,
    ForecastData,
    ColorModifiersData,
    ColorModifiers,
    DailyForecast,
    Rating,
    WeatherImageMap
} from './interfaces/index';
import { HTMLZooduckCarouselElement } from '../zooduck-carousel/zooduck-carousel.component';
import { weatherImageMap } from './utils/weather-image-map';
import * as images from '../../../assets/img/*.png';
/* eslint-enable */
export class SkyduckWeatherElements {
    private _dailyForecast: DailyForecast;
    private _domParser: DOMParser;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _googleMapsKey: string;
    private _imageMap: WeatherImageMap;
    private _requestTime: string;
    private _defaultForecastHours = [9, 12, 15];
    private _version: string;

    constructor(
        dailyForecast: DailyForecast,
        googleMapsKey: string,
        version: string) {
        this._dailyForecast = dailyForecast;
        this._requestTime = DateTime
            .fromMillis(dailyForecast.weather.requestTime)
            .toLocaleString(DateTime.DATETIME_SHORT)
            .replace(',', '');
        this._domParser = new DOMParser();
        this._googleMapsKey = googleMapsKey;
        this._imageMap = weatherImageMap;
        this._version = `v${version.split('-')[0]}`;
    }

    private _buildFooter(): HTMLElement {
        const footer = this._domParser.parseFromString(`
            <div class="footer">
                <span>${this._requestTime}</span>
                <a href="https://darksky.net/poweredby/" target="_blank">Powered by Dark Sky</a>
            </div>
        `, 'text/html').body.firstChild;

        return footer as HTMLElement;
    }

    private _buildForecast(dayForecast: ForecastData): HTMLElement {
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

        const averageRatingModifier = this._getAverageRatingModifier(hourly);
        const sunsetColorModifier = `--${weatherRatings.sunset(sunsetTime, this._dailyForecast.weather.timezone)}`;

        const forecast = this._domParser.parseFromString(`
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
        `, 'text/html').body.firstChild;

        hours.forEach((hour: HTMLElement) => {
            forecast.appendChild(hour);
        });

        return forecast as HTMLElement;
    }

    private _buildForecastCarousel(): HTMLZooduckCarouselElement {
        const carousel = document.createElement('zooduck-carousel');
        carousel.setAttribute('id', 'forecastCarousel');

        const forecastSlides = this._dailyForecast.weather.daily.data.filter((dailyData) => {
            return dailyData.hourly.length;
        }).map((dailyData) => {
            return this._buildForecast(dailyData);
        });

        const slidesSlot = document.createElement('div');
        slidesSlot.setAttribute('slot', 'slides');
        slidesSlot.className = 'forecast-slides';

        forecastSlides.forEach((slide) => {
            slidesSlot.appendChild(slide);
        });

        const slideSelectorsSlot = this._buildForecastSlideSelectorsSlot();

        carousel.appendChild(slideSelectorsSlot);
        carousel.appendChild(slidesSlot);

        carousel.addEventListener('slidechange', (e: CustomEvent) => {
            const { detail } = e;
            const slideSelectorSlots = Array.from(slideSelectorsSlot.children);
            slideSelectorSlots.forEach((slideSelector: HTMLElement, i: number) => {
                slideSelector.classList.remove('--active');

                if (i === detail.currentSlide.index) {
                    slideSelector.classList.add('--active');
                }
            });
        });

        return carousel as HTMLZooduckCarouselElement;
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

        const weatherImagePath = this._imageMap[icon] || this._imageMap.default;
        const colorModifiers = this._getColorModifiers(hourlyData);
        const averageRatingModifier = this._getAverageRatingModifier([hourlyData]);

        const isMode3h = this._defaultForecastHours.includes(parseInt(timeString, 10));
        const forecastDisplayModeModifier = isMode3h ? '--3h' : '--24h';

        const hourlyModeAnimationDelay = (hourlyDataIndex) * .10;
        const hourlyModeAnimationDelayStyle = `animation-delay: ${hourlyModeAnimationDelay}s;`;

        const forecastHour = this._domParser.parseFromString(`
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

    private _buildForecastSlideSelectorsSlot(): HTMLElement {
        const days = this._dailyForecast.weather.daily.data;

        const averageRatingTabs: HTMLElement[] = days.map((day) => {
            const averageRatingModifier = this._getAverageRatingModifier(day.hourly);

            const forecastSlideSelector = this._domParser.parseFromString(`
                <div class="forecast-slide-selectors__item ${averageRatingModifier}"></div>
            `, 'text/html').body.firstChild as HTMLElement;

            return forecastSlideSelector;
        });

        const forecastSlideSelectors = this._domParser.parseFromString(`
            <div slot="slide-selectors" class="forecast-slide-selectors"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        averageRatingTabs.forEach((tab: HTMLElement) => {
            forecastSlideSelectors.appendChild(tab);
        });

        return forecastSlideSelectors;
    }

    private _buildGoogleMap(): HTMLIFrameElement {
        const params = {
            key: this._googleMapsKey,
            q: this._dailyForecast.club.place,
            zoom: '8',
            center: `${this._dailyForecast.weather.latitude},${this._dailyForecast.weather.longitude}`,
            maptype: 'roadmap',
        };
        const queryString = new URLSearchParams(params).toString();
        const url = `https://google.com/maps/embed/v1/place?${queryString}`;
        const iframe = this._domParser.parseFromString(
            `<iframe src="${url}" frameborder="0" class="club-info-grid__map"></iframe>
        `, 'text/html').body.firstChild;

        return iframe as HTMLIFrameElement;
    }

    private _buildHeader(): HTMLElement {
        // ===================================================================
        // NOTE: The skyduck-logo.png was taken from a screenshot
        // using markup generated by the commented out lines in this method.
        // This was neccessary because the font being used by SKYDUCK did not
        // render correctly in either Chrome or Samsung browser on Android.
        // ===================================================================
        const header = this._domParser.parseFromString(`
            <div class="header">
                <div class="header-title-container">
                    <img class="header__skyduck-logo" src="${images['skyduck-logo']}" alt="skyduck-logo" />
                    <!-- <h1 class="header-title-container__title">SKYDUCK</h1> -->
                    <small>${this._version}</small>
                    <!-- <span class="header-title-container__title-stripe"></span> -->
                </div>
                ${this._buildLocationIcon().outerHTML}
            </div>
        `, 'text/html').body.firstChild;

        // header.insertBefore(this._buildSkyduckIcon(), header.childNodes[0]);

        return header as HTMLElement;
    }

    private _buildLocalTimeAndUnitsInfo(): HTMLElement {
        const { weather } = this._dailyForecast;
        const locationTime = DateTime.local()
            .setZone(weather.timezone)
            .toLocaleString(DateTime.TIME_24_SIMPLE);

        const localTimeAndUnitsInfoGrid = this._domParser.parseFromString(`
            <ul class="local-time-and-units-info-grid">
                <li>Local time: ${locationTime}</li>
                <li>miles, mph, celsius</li>
            </ul>
        `, 'text/html').body.firstChild;

        return localTimeAndUnitsInfoGrid as HTMLElement;
    }

    private _buildLocationIcon(): HTMLElement {
        const locationIcon = this._domParser.parseFromString(`
            <zooduck-icon-location
                id="getForecastForCurrentLocation"
                class="header__location-icon"
                size="38"
                color="var(--lightskyblue)"></zooduck-icon-location>
        `, 'text/html').body.firstChild;

        return locationIcon as HTMLElement;
    }

    private _buildLocationInfo(): HTMLElement {
        const locationInfo = document.createElement('div');
        locationInfo.className = 'club-info-grid';
        locationInfo.appendChild(this._buildGoogleMap());
        locationInfo.appendChild(this._buildPlace());
        locationInfo.appendChild(this._buildLocalTimeAndUnitsInfo());

        return locationInfo;
    }

    private _buildPlace(): HTMLElement {
        const { countryRegion, club } = this._dailyForecast;
        const name = countryRegion
            ? club.place.split(',')[0]
            : club.name;
        const place = countryRegion
            ? club.place.substr(name.length).concat(',').concat(countryRegion)
            : club.place;
        const title = `
            <h3>${name}</h3>
        `;
        const siteLink = club.site
            ? `<a class="club-info-grid-location-info__site-link" href="${club.site}" target="_blank">${club.site.replace(/https?:\/+/, '')}</a>`
            : '';
        const placeEl = this._domParser.parseFromString(`
            <div class="club-info-grid-location-info">
                ${title}
                ${this._formatPlace(place)}
                ${siteLink}
            </div>
        `, 'text/html').body.firstChild;

        return placeEl as HTMLElement;
    }

    private _buildSearch(): HTMLElement {
        const search = this._domParser.parseFromString(`
            <div class="search">
                <zooduck-input label="Location Search" placeholder="e.g. Perris, CA 92570, USA"></zooduck-input>
            </div>
        `, 'text/html').body.firstChild;

        return search as HTMLElement;
    }

    private _buildSkyduckIcon(): HTMLElement {
        const skyduckIcon = this._domParser.parseFromString(`
            <zooduck-icon-skyduck size="60" color="var(--lightskyblue)"></zooduck-icon-skyduck>

        `, 'text/html').body.firstChild;

        return skyduckIcon as HTMLElement;
    }

    private _buildForecastDisplayModeToggle(): HTMLElement {
        const toggleContainer = this._domParser.parseFromString(`
            <div class="controls">
                <h4 id="clubListCtrl" class="controls__view-club-list">Clubs</h4>
                <zooduck-icon-toggle
                    id="forecastDisplayModeToggle"
                    class="controls__forecast-display-mode-toggle"
                    size="70"
                    toggleoncolor="var(--lightskyblue)"
                    toggleontext="24h"
                    toggleofftext="3h"
                    fontfamily="Roboto, sans-serif"></zooduck-icon-toggle>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return toggleContainer;
    }

    private _formatPlace(place: string): string {
        const parts = place.split(',');
        const uniqueParts = [];
        parts.forEach((part) => {
            const _part = part.trim();
            if (!uniqueParts.includes(_part)) {
                uniqueParts.push(_part);
            }
        });
        const html = uniqueParts.map((part) => {
            return `<span>${part}</span>`;
        });

        return html.join('');
    }

    private _getAverageRatingModifier(hourlyForecasts: HourlyData[]): ColorModifier {
        const hourlyRatings = hourlyForecasts.map((hour: HourlyData): Rating[] => {
            const { cloudCover, windGust } = hour;

            return [
                weatherRatings.cloudCover(cloudCover),
                weatherRatings.windGust(windGust),
            ];
        });
        const averageRatingModifier = `--${weatherRatings.average(hourlyRatings)}` as ColorModifier;

        return averageRatingModifier;
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

    public get locationInfo(): HTMLElement {
        return this._buildLocationInfo();
    }

    public get footer(): HTMLElement {
        return this._buildFooter();
    }

    public get forecast(): HTMLElement {
        this._forecastCarousel = this._buildForecastCarousel();

        return this._forecastCarousel;
    }

    public get forecastDisplayModeToggle(): HTMLElement {
        return this._buildForecastDisplayModeToggle();
    }

    public get header(): HTMLElement {
        return this._buildHeader();
    }

    public get search(): HTMLElement {
        return this._buildSearch();
    }
}
