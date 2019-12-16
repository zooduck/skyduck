import { style } from './skyduck-weather.style';
import { SkyduckWeatherElements } from './skyduck-weather.elements';
import { SkyduckWeather } from './skyduck-weather';
/* eslint-disable */
import {
    ModifierClasses,
    SearchType,
    SetContentOptions,
    WeatherElements,
    DailyForecast,
    GeocodeData,
    SkydiveClub,
} from './interfaces/index';
import { LatLonSpin } from './utils/lat-lon-spin';
import { weatherImageMap } from './utils/weather-image-map';
import { DateTime } from 'luxon';
import { graphqlConfig } from '../../config/graphql.config';
import { skydiveClubsQuery } from './graphql-queries/skydive-clubs-query';
import { DistanceBetweenPoints } from './utils/distance-between-points';
import { Spinner } from './css-icons/spinner/spinner';

const tagName = 'skyduck-weather';

/* eslint-enable */
class HTMLSkyduckWeatherElement extends HTMLElement {
    private _club: string;
    private _clubs: any;
    private _domParser: DOMParser;
    private _error: string;
    private _forecast: DailyForecast;
    private _geocodeData: GeocodeData;
    private _googleMapsKey: string;
    private _imagesReady = false;
    private _isSearchInProgress = false;
    private _modifierClasses: ModifierClasses = {
        ready: '--ready',
        error: '--error',
    };
    private _onSearchSubmit: EventListener;
    private _position: Position;
    private _location: string;
    private _latLonSpin: LatLonSpin;
    private _searchType: SearchType = 'club';
    private _version: string;
    private _weather: SkyduckWeather;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this._domParser = new DOMParser();
        this._latLonSpin = new LatLonSpin();
        this._weather = new SkyduckWeather();

        navigator.geolocation.getCurrentPosition((position) => {
            this._position = position;
        }, (err) => {
            alert(err.message);
        });
    }

    static get observedAttributes() {
        return [
            'club',
            'location',
        ];
    }

    public get club(): string {
        return this._club;
    }

    public set club(val: string|null) {
        this._club = val;
        if (val !== null) {
            this.removeAttribute('location');
            this._updateContent();
        }
        this._syncStringAttr('club', this.club);
    }

    public get location() {
        return this._location;
    }

    public set location(val: string|null) {
        this._location = val;
        if (val !== null) {
            this._geocodeLookup(this._location).then(() => {
            }).catch((err) => {
                console.error(err); // eslint-disable-line no-console
                this._error = err;
            }).then(() => {
                this.removeAttribute('club');
                this._updateContent();
            });
        }
        this._syncStringAttr('location', this._location);
    }

    private _addClubListCarousel() {
        if (this.shadowRoot.querySelector('#clubListCarousel')) {
            return;
        }

        const clubListCarousel = this._getClubList();
        this._addEventsToCarousel(clubListCarousel);
        this.shadowRoot.appendChild(clubListCarousel);
    }

    private _addEventListeners(): void {
        this._onSearchSubmit = (e: CustomEvent) => {
            const { value } = e.detail;

            if (!value || this._isSearchInProgress) {
                return;
            }

            this._isSearchInProgress = true;

            this.scrollIntoView();

            const searchTypeFormData = new FormData(this.shadowRoot.querySelector('.search__radios'));
            this._searchType = searchTypeFormData.get('searchType') as SearchType;

            switch (this._searchType) {
            case 'club':
                this.club = value;
                break;
            case 'location':
                this.location = value;
                break;
            default: // do nothing
            }
        };

        this.shadowRoot.querySelector('zooduck-input')
            .addEventListener('keypress:enter', this._onSearchSubmit);

        this.shadowRoot.querySelector('#clubListLink')
            .addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this._getClubs();
            });

        this.shadowRoot.querySelector('.header__location-icon')
            .addEventListener('pointerdown', async (e) => {
                e.preventDefault();

                if (!this._position) {
                    return;
                }

                try {
                    await this._reverseGeocodeLookup(this._position.coords);
                    this.removeAttribute('club');
                    this._updateContent();
                } catch (err) {
                    throw Error(err);
                }
            });

        const forecastCarousel = this.shadowRoot.querySelector('#forecastCarousel') as HTMLElement;
        this._addEventsToCarousel(forecastCarousel);
    }

    private _addEventsToCarousel(carousel: HTMLElement): void {
        carousel
            .addEventListener('pointerdown', (e) => {
                e.preventDefault();

                const searchInput = this.shadowRoot.querySelector('zooduck-input') as HTMLInputElement;

                if (!searchInput) {
                    return;
                }

                searchInput.blur();
            });
    }

    private _clearContent(): void {
        this.shadowRoot.innerHTML = '';
        this.classList.remove(this._modifierClasses.ready);
        this.classList.remove(this._modifierClasses.error);
    }

    private async _geocodeLookup(place: string): Promise<void> {
        try {
            const response = await fetch(`/geocode?place=${place}`);

            if (!response.ok) {
                throw(`(${response.status}) ${response.statusText}`);
            }

            const json = await response.json();
            const resource = json.resourceSets[0].resources[0];

            if (!resource) {
                this._geocodeData = null;
                throw(`Unable to resolve coordinates for location of "${place}."`);
            }

            const coords = resource.geocodePoints[0].coordinates;
            const { name, address } = resource;

            this._geocodeData = {
                locationQuery: place,
                address,
                name,
                latitude: coords[0],
                longitude: coords[1],
            };
        } catch (err) {
            throw Error(err);
        }
    }

    private _getClubListItem(country: string,  club: SkydiveClub): HTMLElement {
        const { furthestDZDistance } = this._clubs[country];
        const distanceFromCurrentLocation = club.distance;
        const clubListItemDistanceStyle = `
            ${!this._position ? 'display: none;' : ''}
            grid-template-columns: minmax(auto, ${Math.round((club.distance / furthestDZDistance) * 100)}%) auto;
        `;
        const distanceColorModifier = distanceFromCurrentLocation >= 200
            ? '--red'
            : distanceFromCurrentLocation >= 100
                ? '--amber'
                : '--green';
        const clubListItem = this._domParser.parseFromString(`
            <li class="club-list-item">
                <div class="club-list-item-distance" style="${clubListItemDistanceStyle}">
                    <span class="club-list-item-distance__marker ${distanceColorModifier}"></span>
                    <div class="club-list-item-distance__miles">
                        <span>${distanceFromCurrentLocation}</span>
                        <small>miles</small>
                    </div>
                </div>
                <h3 class="club-list-item__name">${club.name}</h3>
                <span class="club-list-item__place">${club.place}</span>
                <a class="club-list-item__site-link" href="${club.site}" target="_blank">${club.site.replace(/https?:\/\//, '')}</a>
            </li>`, 'text/html').body.firstChild as HTMLElement;

        clubListItem.addEventListener('click', () => {
            const clubName = clubListItem.querySelector('.club-list-item__name').innerHTML;
            this.club = clubName;
        });

        return clubListItem;
    }

    /* eslint-disable indent */
    private _getClubListContainers(): HTMLElement[] {
        const clubListContainers = Object.keys(this._clubs).map((country) => {
            const numberOfClubs = this._clubs[country].list.length;
            const clubListCountry = `<h2 class="club-list-container__country">${country} (${numberOfClubs})</h2>`;
            const clubList = this._domParser.parseFromString(`
                <div class="club-list-container" id="clubList${country}">
                    ${clubListCountry}
                    <ul class="club-list-container__club-list"></ul>
                </div>
            `, 'text/html').body.firstChild as HTMLElement;

            this._clubs[country].list.map((club: SkydiveClub) => {
                return this._getClubListItem(country, club);
            }).forEach((clubListItem: HTMLElement) => {
                const ul = clubList.querySelector('.club-list-container__club-list');
                ul.appendChild(clubListItem);
            });

            return clubList;
        });

        return clubListContainers;
    }

    private _getClubList(): HTMLElement {
        const clubListCarousel = this._domParser.parseFromString(`
            <skyduck-carousel id="clubListCarousel">
                <div slot="slides"></div>
            </skyduck-carousel>
        `, 'text/html').body.firstChild as HTMLElement;

        const slidesSlot = clubListCarousel.querySelector('[slot=slides]');
        const slides = this._getClubListContainers();
        slides.forEach((slide: HTMLElement) => {
            slidesSlot.appendChild(slide);
        });

        return clubListCarousel;
    }

    /* eslint-enable indent */
    private async _getClubs(): Promise<any> {
        try {
            if (this._clubs) {
                this._addClubListCarousel();

                const clubList = this.shadowRoot.querySelector('#clubListCarousel');
                clubList.scrollIntoView({ behavior: 'smooth' });

                return this._clubs;
            }

            const graphqlResult = await fetch(graphqlConfig.uri, {
                ...graphqlConfig.options,
                body: JSON.stringify({
                    query: skydiveClubsQuery,
                }),
            });

            const json = await graphqlResult.json();
            const clubs = json.data.clubs.map((club: SkydiveClub) => {
                const distanceInMiles = this._position
                    ? new DistanceBetweenPoints({
                        from: {
                            latDeg: this._position.coords.latitude,
                            lonDeg: this._position.coords.longitude,
                        },
                        to: {
                            latDeg: club.latitude,
                            lonDeg: club.longitude,
                        }
                    }).miles
                    : 0;

                return {
                    ...club,
                    distance: distanceInMiles,
                };
            });

            if (this._position) {
                this._sortClubsByDistance(clubs);
            } else {
                this._sortClubsByName(clubs);
            }

            this._clubs = this._sortClubsByCountry(clubs);

            this._addClubListCarousel();

            const clubList = this.shadowRoot.querySelector('#clubListCarousel');
            clubList.scrollIntoView({ behavior: 'smooth' });

            return this._clubs;
        } catch (err) {
            throw new Error(err);
        }
    }

    private async _getGoogleMapsKey(): Promise<string> {
        if (!this._googleMapsKey) {
            const response =  await fetch('/googlemapskey');
            this._googleMapsKey = response.status === 200 ? await response.text() : '';
        }

        return this._googleMapsKey;
    }

    private async _getImages(): Promise<void> {
        const imagesLoaded = [];

        return new Promise((resolve) => {
            const imageLinks = Object.keys(weatherImageMap).map((key) => {
                return {
                    key,
                    url: weatherImageMap[key],
                };
            });
            imageLinks.forEach(async (link) => {
                const response = await fetch(link.url);

                if (response.ok) {
                    await this._loadImage(link.url);
                }

                imagesLoaded.push(link);

                if (imagesLoaded.length === imageLinks.length) {
                    this._imagesReady = true;
                    resolve();
                }
            });
        });
    }

    private _getLoader(): HTMLElement {

        const loader = this._domParser.parseFromString(`
            <div class="loader" id="skyduck-loader">
                <div class="loader-info">
                    <div id="loaderInfoLat"></div>
                    <div id="loaderInfoLon"></div>
                    <div id="loaderInfoPlace" class="loader-info__place"></div>
                    <div id="loaderInfoIANA"></div>
                    <div id="loaderInfoLocalTime"></div>
                </div>
                <div id="loaderError" class="loader__error"></div>
                ${this._getSpinner().outerHTML}
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        loader.addEventListener('click', () => {
            if (this._forecast && this._error) {
                this._error = '';
                this.classList.remove(this._modifierClasses.error);
                this._setContent({
                    useLoader: false,
                });
            }
        });

        return loader as HTMLElement;
    }

    private _getSpinner(): HTMLElement {
        const spinner = new Spinner().html;
        spinner.classList.add('loader__spinner');

        return spinner;
    }

    private _getStyle(): HTMLStyleElement {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;

        return styleEl;
    }

    private async _loaderInfoDisplay(): Promise<void> {
        const { club, weather } = this._forecast;
        const delayBetweenInfoMessages = 500;
        const loaderInfoLat = this.shadowRoot.querySelector('#loaderInfoLat') as HTMLElement;
        const loaderInfoLon = this.shadowRoot.querySelector('#loaderInfoLon') as HTMLElement;
        const loaderInfoPlace = this.shadowRoot.querySelector('#loaderInfoPlace');
        const loaderInfoIANA = this.shadowRoot.querySelector('#loaderInfoIANA');
        const loaderInfoLocalTime = this.shadowRoot.querySelector('#loaderInfoLocalTime');

        this._latLonSpin.apply(loaderInfoLat, 'Lat:&nbsp;');
        await this._wait(delayBetweenInfoMessages);
        this._latLonSpin.setContent(loaderInfoLat, `Lat: ${weather.latitude.toString().substr(0, 9)}`);

        this._latLonSpin.apply(loaderInfoLon, 'Lon:&nbsp;');
        await this._wait(delayBetweenInfoMessages);
        this._latLonSpin.setContent(loaderInfoLon, `Lon: ${weather.longitude.toString().substr(0, 9)}`);

        loaderInfoPlace.innerHTML = `Place: ${club.place}`;
        await this._wait(delayBetweenInfoMessages);

        loaderInfoIANA.innerHTML = `IANA: ${weather.timezone}`;
        await this._wait(delayBetweenInfoMessages);

        const locationTime = DateTime.local()
            .setZone(this._forecast.weather.timezone)
            .toLocaleString(DateTime.TIME_24_SIMPLE);

        loaderInfoLocalTime.innerHTML = `Local Time: ${locationTime}`;
        await this._wait(delayBetweenInfoMessages);
    }

    private _loadImage(src: string) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = src;
        });
    }

    private async _reverseGeocodeLookup(point: Coordinates): Promise<void> {
        try {
            const { latitude, longitude } = point;
            const response = await fetch(`/reverse_geocode?point=${latitude},${longitude}`);

            if (!response.ok) {
                throw(`(${response.status}) ${response.statusText}`);
            }

            const json = await response.json();
            const resource = json.resourceSets[0].resources[0];

            if (!resource) {
                this._geocodeData = null;
                throw(`Unable to resolve location for coordinates of "${latitude},${longitude}."`);
            }

            const coords = resource.geocodePoints[0].coordinates;
            const { name, address } = resource;

            this._geocodeData = {
                locationQuery: `Current Location (${latitude},${longitude})`,
                address,
                name,
                latitude: coords[0],
                longitude: coords[1],
            };
        } catch (err) {
            throw Error(err);
        }
    }

    private async _setContent(options: SetContentOptions = { useLoader: true }): Promise<void> {
        this._isSearchInProgress = false;

        if (!this._imagesReady) {
            await this._getImages();
        }

        if (this._error) {
            const minTimeToDisplaySpinner = 1000;

            await this._wait(minTimeToDisplaySpinner);

            this.classList.add(this._modifierClasses.error);

            const loaderError =  this.shadowRoot.querySelector('#loaderError');
            loaderError.innerHTML = this._error;

            return;
        }

        if (options.useLoader) {
            await this._loaderInfoDisplay();
        }

        const googleMapsKey = await this._getGoogleMapsKey();
        const weatherElements: WeatherElements = new SkyduckWeatherElements(this._forecast, googleMapsKey, this._searchType, this._version);
        const {header, locationInfo, search, forecast, footer } = weatherElements;

        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(search);
        this.shadowRoot.appendChild(locationInfo);
        this.shadowRoot.appendChild(forecast);
        this.shadowRoot.appendChild(footer);

        if (this._clubs) {
            this._getClubs();
        }

        this._addEventListeners();

        this.classList.add(this._modifierClasses.ready);
        this.classList.remove(this._modifierClasses.error);

        this.scrollIntoView();
    }

    private _sortClubsByName(clubs: SkydiveClub[]): void {
        clubs.sort((a: SkydiveClub, b: SkydiveClub) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    private _sortClubsByDistance(clubs: SkydiveClub[]): void {
        clubs.sort((a: SkydiveClub, b: SkydiveClub) => {
            return a.distance - b.distance;
        });
    }

    private _sortClubsByCountry(clubs: SkydiveClub[]): any {
        const clubsByCountry = {};
        clubs.forEach((club: SkydiveClub) => {
            if (!clubsByCountry[club.country]) {
                clubsByCountry[club.country] = {
                    furthestDZDistance: .1,
                    list: [],
                };
            }
            const { list, furthestDZDistance } = clubsByCountry[club.country];

            list.push(club);

            if (club.distance > furthestDZDistance) {
                clubsByCountry[club.country].furthestDZDistance = club.distance;
            }
        });

        const sortedKeys = Object.keys(clubsByCountry).sort();
        const clubsByCountrySorted = {};
        sortedKeys.forEach((key: string) => {
            clubsByCountrySorted[key] = clubsByCountry[key];
        });

        return clubsByCountrySorted;
    }

    private _syncStringAttr(name: string, val: string) {
        if (this.getAttribute(name) === val) {
            return;
        }

        this.setAttribute(name, val);
    }

    private async _updateContent(): Promise<void> {
        this._clearContent();

        this.shadowRoot.appendChild(this._getStyle());
        this.shadowRoot.appendChild(this._getLoader());

        if (!this.club && !this._geocodeData) {
            this._setContent();

            return;
        }

        try {
            if (this._club) {
                this._forecast = await this._weather.getDailyForecastByClub(this.club);
            } else if (this._geocodeData) {
                this._forecast = await this._weather.getDailyForecastByQuery(this._geocodeData);
            }
            this._error = '';
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
            this._error = err;
        } finally {
            this._setContent();
        }
    }

    private _wait(delay: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    protected attributeChangedCallback(name: string, _oldVal: any, newVal: any) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }

    protected async connectedCallback() {
        const versionResponse = await fetch('/version');
        this._version = await versionResponse.text();
    }
}

customElements.define(tagName, HTMLSkyduckWeatherElement);
