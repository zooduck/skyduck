import { style } from './skyduck.style';
import { SkyduckWeatherElements } from './skyduck.elements';
import { SkyduckWeather } from './skyduck.weather';
/* eslint-disable */
import {
    ModifierClasses,
    SetContentOptions,
    WeatherElements,
    DailyForecast,
    GeocodeData,
    SkydiveClub,
    ClubListsSortedByCountry,
    LocationDetails,
    Coords,
    HTMLZooduckCarouselElement,
} from './interfaces/index';
import { LatLonSpin } from './utils/lat-lon-spin';
import { imageMap } from './utils/image-map';
import { DateTime } from 'luxon';
import { isTap } from '../../utils/is-tap/is-tap';
import { wait } from '../../utils/wait/wait';
import { PointerEventDetails, EventDetails } from '../../utils/pointer-event-details/pointer-event-details'; // eslint-disable-line no-unused-vars
import { LoaderTemplate } from './templates/loader.template';
import { geocodeLookup } from './fetch/geocode-lookup.fetch';
import { ClubListCarouselTemplate } from './templates/club-list-carousel.template';
import { reverseGeocodeLookup } from './fetch/reverse-geocode-lookup.fetch';
import { skydiveClubsLookup } from './fetch/skydive-clubs.fetch';

interface PointerEvents {
    pointerdown: EventDetails[];
}

type LoaderMessageElements = {
    [key: string]: HTMLElement;
}

const tagName = 'sky-duck';
const geolocationBlockedByUserMessage = `
Geolocation permission has been blocked
 as the user has dismissed the permission prompt.
 This can be reset in Page Info which can be accessed
 by clicking the lock icon next to the URL.
`.trim().replace(/\n/g, '');

/* eslint-enable */
class HTMLSkyDuckElement extends HTMLElement {
    private _club: string;
    private _clubs: SkydiveClub[];
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _defaultClub: string;
    private _error: string;
    private _forecast: DailyForecast;
    private _firstLoadDelayMillis: number;
    private _geocodeData: GeocodeData;
    private _googleMapsKey: string;
    private _hasLoaded = false;
    private _imagesReady = false;
    private _isSearchInProgress = false;
    private _latLonSpin: LatLonSpin;
    private _loaderMessageElements: LoaderMessageElements;
    private _locationDetails: LocationDetails;
    private _modifierClasses: ModifierClasses;
    private _nearestClub: SkydiveClub;
    private _onSearchSubmit: EventListener;
    private _pointerEventDetails: PointerEventDetails;
    private _pointerEvents: PointerEvents;
    private _position: Position;
    private _location: string;
    private _version: string;
    private _weather: SkyduckWeather;

    constructor () {
        super();

        this.attachShadow({ mode: 'open' });

        this._defaultClub = 'skydive algarve';
        this._firstLoadDelayMillis = 10000;
        this._latLonSpin = new LatLonSpin();
        this._modifierClasses = {
            error: '--error',
            init: '--init',
            ready: '--ready',
        };
        this._pointerEventDetails = new PointerEventDetails();
        this._pointerEvents = {
            pointerdown: [],
        };
        this._weather = new SkyduckWeather();
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

    public set club(val: string) {
        this._club = val;
        this._syncStringAttr('club', this.club);

        if (val) {
            this.removeAttribute('location');

            if (!this._hasLoaded) {
                return;
            }

            this._updateContent();
        }
    }

    public get location() {
        return this._location;
    }

    public set location(val: string) {
        this._location = val;
        this._syncStringAttr('location', this._location);

        if (val) {
            this.removeAttribute('club');

            geocodeLookup(this._location).then((response) => {
                this._geocodeData = response;
            }).catch((err) => {
                console.error(err); // eslint-disable-line no-console

                this._geocodeData = null;
                this._error = err;
            }).then(() => {
                if (!this._hasLoaded) {
                    return;
                }

                this._updateContent();
            });
        }
    }

    private _getClubData(): SkydiveClub {
        return this._clubs.find((club: SkydiveClub) => {
            return new RegExp(this._club).test(club.name);
        });
    }

    private _addClubListCarousel() {
        if (this.shadowRoot.querySelector('#clubListCarousel')) {
            return;
        }

        const clubListCarousel = new ClubListCarouselTemplate(this._clubsSortedByCountry, this._nearestClub, this._position).html;
        this._registerEventsOnCarousel(clubListCarousel);
        this.shadowRoot.appendChild(clubListCarousel);
    }

    private async _addStyleAndLoader() {
        this.shadowRoot.appendChild(this._getStyle());
        this.shadowRoot.appendChild(this._getLoader());
    }

    private _blurSearchInput() {
        const searchInput = this.shadowRoot.querySelector('zooduck-input') as HTMLInputElement;

        if (!searchInput) {
            return;
        }

        searchInput.blur();
    }

    private _clearContent(): void {
        Array.from(this.shadowRoot.children).forEach((child: HTMLElement) => {
            const isStyleTag = /style/i.test(child.nodeName);
            const isLoader = /skyduckLoader/.test(child.id);
            if (!isStyleTag && !isLoader) {
                child.parentNode.removeChild(child);
            }
        });

        this._resetLoaderMessages();

        this.classList.remove(this._modifierClasses.ready);
        this.classList.remove(this._modifierClasses.error);
    }

    private _customElementLoaded(customElement: HTMLElement): Promise<void> {
        return new Promise((resolve: any) => {
            customElement.addEventListener('load', resolve);
        });
    }

    private _getCurrentPosition(): Promise<void> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                this._position = position;
                resolve();
            }, async (err) => {
                const errorMessage = err.code === 1
                    ? geolocationBlockedByUserMessage
                    : err.message;
                alert(errorMessage);
                resolve();
            });
        });
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
            const imageLinks = Object.keys(imageMap).map((key) => {
                return {
                    key,
                    url: imageMap[key],
                };
            });
            imageLinks.forEach(async (link) => {
                try {
                    const request = new Request(link.url);
                    const response = await fetch(request);

                    if (response.ok) {
                        await this._loadImage(link.url);
                    }
                } catch (err) {
                    console.error(err); // eslint-disable-line no-console
                } finally {
                    imagesLoaded.push(link);
                }

                if (imagesLoaded.length === imageLinks.length) {
                    this._imagesReady = true;
                    resolve();
                }
            });
        });
    }

    private _getLoader(): HTMLElement {
        const loaderTemplate = new LoaderTemplate();
        const loader = loaderTemplate.html;

        loader.addEventListener('pointerup', (e: PointerEvent) => {
            e.preventDefault();

            if (this._forecast && this._error) {
                this._error = '';
                this.classList.remove(this._modifierClasses.error);
                this._setContent({
                    useLoader: false,
                });
            }
        });

        this._loaderMessageElements = loaderTemplate.infoElements;

        return loader;
    }

    private _getStyle(): HTMLStyleElement {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;

        return styleEl;
    }

    /* eslint-enable indent */
    private async _initClubs(): Promise<void> {
        try {
            const clubs = await skydiveClubsLookup(this._position);
            if (this._position) {
                this._sortClubsByDistance(clubs);

                this._nearestClub = clubs[0];

                if (!this._club && !this._location) {
                    this.club = this._nearestClub.name;
                }
            } else {
                this._sortClubsByName(clubs);

                if (!this._club && !this._location) {
                    this.club = this._defaultClub;
                }
            }

            this._clubs = clubs;
            this._clubsSortedByCountry = this._sortClubsByCountry(clubs);
        } catch (err) {
            this._error = err;
            this._setLoaderError();
        }
    }

    private _loadImage(src: string) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = src;
        });
    }

    private _registerEvents(): void {
        this._onSearchSubmit = (e: CustomEvent) => {
            this._clearContent();

            const { value } = e.detail;

            if (!value || this._isSearchInProgress) {
                return;
            }

            this._isSearchInProgress = true;

            this.location = value;
        };

        if ('PointerEvent' in window) {
            this.addEventListener('pointerdown', (e: PointerEvent) => {
                const eventDetails = this._pointerEventDetails.fromPointer(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
        } else {
            this.addEventListener('mousedown', (e: MouseEvent) => {
                const eventDetails = this._pointerEventDetails.fromMouse(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
            this.addEventListener('touchstart', (e: TouchEvent) => {
                const eventDetails = this._pointerEventDetails.fromTouch(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
        }

        this.shadowRoot.querySelector('zooduck-input')
            .addEventListener('keyup:enter', this._onSearchSubmit);

        this.shadowRoot.querySelector('#clubListCtrl')
            .addEventListener('pointerup', (e) => {
                e.preventDefault();

                this._showClubList();
            });

        this.shadowRoot.querySelector('#getForecastForCurrentLocation')
            .addEventListener('pointerup', async (e) => {
                e.preventDefault();

                if (!this._position) {
                    return;
                }

                try {
                    const reverseGeocodeLookupResponse = await reverseGeocodeLookup(this._position.coords);
                    this._geocodeData = reverseGeocodeLookupResponse;
                    this.removeAttribute('club');
                    this._updateContent();
                } catch (err) {
                    throw Error(err);
                }
            });


        const forecastDisplayModeToggle = this.shadowRoot.querySelector('#forecastDisplayModeToggle');
        forecastDisplayModeToggle.addEventListener('pointerup', (e: PointerEvent) => {
            e.preventDefault();

            const forecastCarousel = this.shadowRoot.querySelector('#forecastCarousel') as HTMLZooduckCarouselElement;

            forecastCarousel.classList.toggle('--forecast-display-mode-24h');

            forecastCarousel.updateCarouselHeight();
        });

        const forecastCarousel = this.shadowRoot.querySelector('#forecastCarousel') as HTMLElement;
        this._registerEventsOnCarousel(forecastCarousel);
    }

    private _registerEventsOnCarousel(carousel: HTMLElement): void {
        if ('PointerEvent' in window) {
            carousel.addEventListener('pointerdown', (e: PointerEvent) => {
                const eventDetails = this._pointerEventDetails.fromPointer(e);
                this._pointerEvents.pointerdown.push(eventDetails);

                this._blurSearchInput();
            });
        } else {
            carousel.addEventListener('mousedown', (e: MouseEvent) => {
                const eventDetails = this._pointerEventDetails.fromMouse(e);
                this._pointerEvents.pointerdown.push(eventDetails);

                this._blurSearchInput();
            });
            carousel.addEventListener('touchstart', (e: TouchEvent) => {
                const eventDetails = this._pointerEventDetails.fromTouch(e);
                this._pointerEvents.pointerdown.push(eventDetails);

                this._blurSearchInput();
            });
        }

        const clubListItems = Array.from(carousel.querySelectorAll('.club-list-item'));
        clubListItems.forEach((clubListItem: HTMLElement) => {
            this._registerEventsOnClubListItem(clubListItem);
        });
    }

    private _registerEventsOnClubListItem(clubListItem: HTMLElement) {
        const clubListItemName = clubListItem.querySelector('.club-list-item__name');

        if ('PointerEvent' in window) {
            clubListItemName.addEventListener('pointerup', (e: PointerEvent) => {
                const pointerupEventDetails = this._pointerEventDetails.fromPointer(e);
                const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

                if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
                    return;
                }

                this._setClubToSelectedClubFromList(clubListItem);
            });
        } else {
            clubListItemName.addEventListener('mouseup', (e: MouseEvent) => {
                const pointerupEventDetails = this._pointerEventDetails.fromMouse(e);
                const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

                if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
                    return;
                }

                this._setClubToSelectedClubFromList(clubListItem);
            });

            clubListItemName.addEventListener('touchend', (e: TouchEvent) => {
                const pointerupEventDetails = this._pointerEventDetails.fromTouch(e);
                const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

                if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
                    return;
                }

                this._setClubToSelectedClubFromList(clubListItem);
            });
        }
    }

    private _resetLoaderMessages() {
        Array.from(Object.keys(this._loaderMessageElements)).forEach((key: string) => {
            this._loaderMessageElements[key].innerHTML = '';
        });
    }

    private _setClubToSelectedClubFromList(clubListItem: HTMLElement) {
        const clubName = clubListItem.querySelector('.club-list-item__name').innerHTML;
        this.club = clubName;
    }

    private async _setContent(options: SetContentOptions = { useLoader: true }): Promise<void> {
        this._isSearchInProgress = false;

        if (!this._imagesReady) {
            await this._getImages();
        }

        const minTimeToDisplaySpinner = this._hasLoaded ? 500 : 0;

        await wait(minTimeToDisplaySpinner);

        if (this._error) {
            this._setLoaderError();

            return;
        }

        if (options.useLoader && this._hasLoaded) {
            await this._setLoaderInfoDisplay();
        }

        const googleMapsKey = await this._getGoogleMapsKey();

        const weatherElements: WeatherElements = new SkyduckWeatherElements(
            this._locationDetails,
            this._forecast,
            googleMapsKey,
            this._version,
        );

        const {
            header,
            locationInfo,
            search,
            forecast,
            forecastDisplayModeToggle,
            footer,
        } = weatherElements;

        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(search);
        this.shadowRoot.appendChild(locationInfo);
        this.shadowRoot.appendChild(forecastDisplayModeToggle);
        this.shadowRoot.appendChild(forecast);

        await this._customElementLoaded(forecast as HTMLZooduckCarouselElement);

        this.shadowRoot.appendChild(footer);

        this._addClubListCarousel();

        this._registerEvents();

        this.classList.add(this._modifierClasses.ready);
        this.classList.remove(this._modifierClasses.error);
        this.classList.remove(this._modifierClasses.init);

        this._hasLoaded = true;

        this.scrollIntoView();
    }

    private _setLoaderBarSpeed(millis: number): void {
        const loaderBarInner = this.shadowRoot.querySelector('#loaderBarInner') as HTMLElement;
        const style = `
            animation-fill-mode: forwards;
            animation-duration: ${millis}ms;
        `;
        loaderBarInner.setAttribute('style', style);
    }

    private _setLoaderError() {
        this.classList.add(this._modifierClasses.error);

        const loaderError =  this.shadowRoot.querySelector('#loaderError');
        loaderError.innerHTML = this._error;
    }

    private async _setLoaderInfoDisplay(): Promise<void> {
        const { weather, formattedAddress, countryRegion } = this._forecast;
        const { latitude, longitude, timezone } = weather;
        const delayBetweenInfoMessages = 500;

        const clubData = this._getClubData();
        const place = clubData
            ? clubData.place
            : `${formattedAddress},${countryRegion}`;

        const {
            loaderInfoLat,
            loaderInfoLon,
            loaderInfoPlace,
            loaderInfoIANA,
            loaderInfoLocalTime,
        } = this._loaderMessageElements;

        this._latLonSpin.apply(loaderInfoLat, 'Lat:&nbsp;');
        await wait(delayBetweenInfoMessages);
        this._latLonSpin.setContent(loaderInfoLat, `Lat: ${latitude.toString().substr(0, 9)}`);

        this._latLonSpin.apply(loaderInfoLon, 'Lon:&nbsp;');
        await wait(delayBetweenInfoMessages);
        this._latLonSpin.setContent(loaderInfoLon, `Lon: ${longitude.toString().substr(0, 9)}`);

        loaderInfoPlace.innerHTML = `${place}`;
        await wait(delayBetweenInfoMessages);

        loaderInfoIANA.innerHTML = `${timezone}`;
        await wait(delayBetweenInfoMessages);

        const locationTime = DateTime.local()
            .setZone(timezone)
            .toLocaleString(DateTime.TIME_24_SIMPLE);

        loaderInfoLocalTime.innerHTML = `Local Time: ${locationTime}`;
        await wait(delayBetweenInfoMessages);
    }

    private _showClubList() {
        const clubList = this.shadowRoot.querySelector('#clubListCarousel');
        clubList.scrollIntoView({ behavior: 'smooth' });
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
                    country: club.country,
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

    private _setLocationDetails(name: string, address: string, site: string, timezone: string, coords: Coords): void {
        this._locationDetails = {
            name,
            address,
            site,
            timezone,
            coords,
        };
    }

    private async _updateContent(): Promise<void> {
        this._clearContent();

        if (!this.club && !this._geocodeData) {
            this._setContent();

            return;
        }

        try {
            if (this._club) {
                this._forecast = await this._weather.getDailyForecastByClub(this.club);

                const { timezone } = this._forecast.weather;
                const { name, place: address, site, latitude, longitude } = this._getClubData();
                const coords = {
                    latitude,
                    longitude,
                };

                this._setLocationDetails(name, address, site, timezone, coords);
            } else if (this._geocodeData) {
                this._forecast = await this._weather.getDailyForecastByQuery(this._geocodeData);

                const site = '';
                const { latitude, longitude, timezone } = this._forecast.weather;
                const { countryRegion: address, formattedAddress: name } = this._forecast;
                const coords = {
                    latitude,
                    longitude,
                };

                this._setLocationDetails(name, address, site, timezone, coords);
            }
            this._error = '';
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
            this._error = err;
        } finally {
            await this._setContent();
        }
    }

    protected async _init(): Promise<void> {
        this.classList.add(this._modifierClasses.init);

        await this._getCurrentPosition();

        await this._addStyleAndLoader();

        this._setLoaderBarSpeed(this._firstLoadDelayMillis);

        await this._initClubs();
    }

    protected attributeChangedCallback(name: string, _oldVal: any, newVal: any) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }

    protected async connectedCallback() {
        const versionResponse = await fetch('/version');
        this._version = await versionResponse.text();

        await this._init();

        await wait(this._firstLoadDelayMillis);

        await this._updateContent();

        this.dispatchEvent(new CustomEvent('load'));
    }
}

customElements.define(tagName, HTMLSkyDuckElement);
