import { style } from './skyduck.style';
import { SkyduckWeatherElements } from './skyduck.elements';
import { SkyduckWeather } from './skyduck.weather';
/* eslint-disable */
import {
    ModifierClasses,
    WeatherElements,
    DailyForecast,
    GeocodeData,
    SkydiveClub,
    ClubListsSortedByCountry,
    LocationDetails,
    Coords,
    HTMLZooduckCarouselElement,
    ForecastDisplayMode,
    MapDisplayMode,
} from './interfaces/index';
/* eslint-enable */
import { LatLonSpin } from './utils/lat-lon-spin';
import { imageMap } from './utils/image-map';
import { DateTime } from 'luxon';
import { isTap } from '../../utils/is-tap/is-tap';
import { wait } from '../../utils/wait/wait';
import { PointerEventDetails, EventDetails } from '../../utils/pointer-event-details'; // eslint-disable-line no-unused-vars
import { LoaderTemplate } from './templates/loader.template';
import { geocodeLookup } from './fetch/geocode-lookup.fetch';
import { reverseGeocodeLookup } from './fetch/reverse-geocode-lookup.fetch';
import { skydiveClubsLookup } from './fetch/skydive-clubs.fetch';
import { escapeSpecialChars } from './utils/escape-special-chars';
import { sortClubsByCountry } from './utils/sort-clubs-by-country';
import { getCurrentPosition } from './utils/get-current-position';
import { Log } from './fetch/log.fetch';

interface AnimateMapOptions {
    hideMap: boolean;
    animationDuration?: number;
}

interface PointerEvents {
    pointerdown: EventDetails[];
}

type LoaderMessageElements = {
    [key: string]: HTMLElement;
}

const tagName = 'sky-duck';

/* eslint-enable */
class HTMLSkyDuckElement extends HTMLElement {
    private _club: string;
    private _clubs: SkydiveClub[];
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _defaultClub: string;
    private _error: string;
    private _forecast: DailyForecast;
    private _forecastDisplayMode: ForecastDisplayMode;
    private _firstLoadDelayMillis: number;
    private _geocodeData: GeocodeData;
    private _googleMapsKey: string;
    private _hasLoaded = false;
    private _imagesReady = false;
    private _latLonSpin: LatLonSpin;
    private _loaderMessageElements: LoaderMessageElements;
    private _location: string;
    private _locationDetails: LocationDetails;
    private _mapDisplayMode: MapDisplayMode;
    private _modifierClasses: ModifierClasses;
    private _nearestClub: SkydiveClub;
    private _onSearchSubmit: EventListener;
    private _pointerEventDetails: PointerEventDetails;
    private _pointerEvents: PointerEvents;
    private _position: Position;
    private _transitionSpeedInMillis: number;
    private _userDeniedGeolocation = false;
    private _version: string;
    private _weather: SkyduckWeather;

    constructor () {
        super();

        this.attachShadow({ mode: 'open' });

        this._defaultClub = 'skydive algarve';
        this._firstLoadDelayMillis = 5000;
        this._forecastDisplayMode = '3h';
        this._latLonSpin = new LatLonSpin();
        this._mapDisplayMode = 'on';
        this._modifierClasses = {
            error: '--error',
            forecastDisplayMode24h: '--forecast-display-mode-24h',
            init: '--init',
            loading: '--loading',
            ready: '--ready',
        };
        this._pointerEventDetails = new PointerEventDetails();
        this._pointerEvents = {
            pointerdown: [],
        };
        this._transitionSpeedInMillis = 250;
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
            this._onClubChange();
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
            this._onLocationChange();
        }
    }

    private async _animateMap(options: AnimateMapOptions) {
        const { hideMap, animationDuration } = options;
        const clubInfoGrid = this.shadowRoot.querySelector('.club-info-grid') as HTMLElement;

        if (!clubInfoGrid) {
            return;
        }

        if (typeof(animationDuration) === 'number') {
            clubInfoGrid.style.transition = `${animationDuration}ms`;
        } else {
            clubInfoGrid.style.transition = `${this._transitionSpeedInMillis}ms`;
        }

        if (hideMap) {
            clubInfoGrid.style.height = `${clubInfoGrid.offsetHeight}px`;
            clubInfoGrid.style.transform = 'translateX(-100%)';
            await wait(10); // some delay necessary for transition on height to work
            clubInfoGrid.style.height = '0';

            return;
        }

        clubInfoGrid.style.height = 'auto';
        clubInfoGrid.style.transform = 'translateX(0)';
    }

    private _addStyleAndLoader() {
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

    private _clearLoaderInfoDisplay() {
        const {
            loaderInfoLat,
            loaderInfoLon,
            loaderInfoPlace,
            loaderInfoIANA,
            loaderInfoLocalTime,
        } = this._loaderMessageElements;

        [
            loaderInfoLat,
            loaderInfoLon,
            loaderInfoPlace,
            loaderInfoIANA,
            loaderInfoLocalTime
        ].forEach((loaderInfoEl: HTMLElement) => {
            loaderInfoEl.innerHTML = '';
        });
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

    private _getClubData(): SkydiveClub {
        if (!this._club) {
            return;
        }

        const clubEscaped = escapeSpecialChars(this._club);

        return this._clubs.find((club: SkydiveClub) => {
            return new RegExp(clubEscaped, 'i').test(club.name);
        });
    }

    private async _getForecast() {
        try {
            if (this._club) {
                this._forecast = await this._weather.getDailyForecastByClub(this._club, this._clubs);
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
                const { latitude, longitude, timezone, } = this._forecast.weather;
                const { countryRegion, formattedAddress, } = this._forecast;
                const coords = {
                    latitude,
                    longitude,
                };

                const formattedAddressPieces = formattedAddress.split(',').map((piece: string) => {
                    return piece.trim();
                });
                if (!formattedAddressPieces.includes(countryRegion)) {
                    formattedAddressPieces.push(countryRegion);
                }
                const name = formattedAddressPieces[0];
                const address = formattedAddressPieces.slice(1).join(',');

                this._setLocationDetails(name, address, site, timezone, coords);
            }
            this._error = '';
        } catch (err) {
            this._error = err;
            this._revertContent();
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
            const imageLinks = Object.keys(imageMap).map((key) => {
                return {
                    key,
                    url: imageMap[key],
                };
            });
            imageLinks.forEach(async (link) => {
                try {
                    await this._loadImage(link.url);
                } catch (err) {
                    console.error(err); // eslint-disable-line no-console
                } finally {
                    imagesLoaded.push(link.url);
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

        loader.addEventListener('click', (e: Event) => {
            e.preventDefault();

            if (this._error) {
                this._setReady();
                this._setLoaded(true);
            }
        });

        this._loaderMessageElements = loaderTemplate.infoElements;

        return loader;
    }

    private _getStyle(): HTMLStyleElement {
        const styleEl = document.createElement('style');
        styleEl.textContent = style({
            transitionSpeedInMillis: this._transitionSpeedInMillis,
        });

        return styleEl;
    }

    private async _onClubChange() {
        this._setLoading();

        if (!this._clubs) {
            await this._initClubs();
        }

        if (!this._getClubData()) {
            this._error = `Could not find club "${this._club}" in the Skyduck database. Try searching by location instead.`;
            this._revertContent();

            return;
        }

        await this._getForecast();
        this._setContent();
    }

    private async _onFirstLoad() {

        this._googleMapsKey =  await this._getGoogleMapsKey();

        this._addStyleAndLoader();

        this._setLoaderBarSpeed(this._firstLoadDelayMillis);

        await this._initClubs();

        await wait(this._firstLoadDelayMillis);
    }

    private _onLocationChange() {
        this._setLoading();

        geocodeLookup(this._location).then(async (response) => {
            this._geocodeData = response;

            try {
                await this._getForecast();
                this._setContent();
            } catch (err) {
                this._error = err;
                this._revertContent();
            }
        }).catch((err) => {
            this._geocodeData = null;
            this._error = err;

            this._revertContent();
        });
    }

    private async _initClubs(): Promise<void> {
        if (this._clubs) {
            return;
        }

        try {
            this._position = await getCurrentPosition();

            try {
                const geocodeData: GeocodeData = await reverseGeocodeLookup(this._position.coords);
                const { name: userLocation } = geocodeData;
                const log = new Log(userLocation);

                log.connection();
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
            this._userDeniedGeolocation = true;
        }

        try {
            const clubs = await skydiveClubsLookup(this._position);

            if (this._position) {
                this._sortClubsByDistance(clubs);

                this._nearestClub = clubs[0];
            } else {
                this._sortClubsByName(clubs);
            }

            this._clubs = clubs;
            this._clubsSortedByCountry = sortClubsByCountry(clubs);
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
            const { value } = e.detail;

            this.location = value;
        };

        if ('PointerEvent' in window) {
            this.addEventListener('pointerdown', (e: PointerEvent) => {
                const eventDetails = this._pointerEventDetails.fromPointer(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
        } else if ('TouchEvent' in window) {
            this.addEventListener('mousedown', (e: MouseEvent) => {
                const eventDetails = this._pointerEventDetails.fromMouse(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
        } else {
            this.addEventListener('touchstart', (e: TouchEvent) => {
                const eventDetails = this._pointerEventDetails.fromTouch(e);
                this._pointerEvents.pointerdown.push(eventDetails);
            });
        }

        const searchInput = this.shadowRoot.querySelector('zooduck-input');
        searchInput && searchInput
            .addEventListener('keyup:enter', this._onSearchSubmit);

        const clubListCtrl = this.shadowRoot.querySelector('#clubListCtrl');
        clubListCtrl && clubListCtrl
            .addEventListener('click', () => {
                this._showClubList();
            });

        const geolocationForecastCtrl = this.shadowRoot.querySelector('#getForecastForCurrentLocation');
        geolocationForecastCtrl && geolocationForecastCtrl
            .addEventListener('click', async () => {
                if (!this._position) {
                    return;
                }

                this._setLoading();

                try {
                    const reverseGeocodeLookupResponse = await reverseGeocodeLookup(this._position.coords);
                    this._geocodeData = reverseGeocodeLookupResponse;
                    const { name: location } = this._geocodeData;

                    if (!location) {
                        // If reverse geocode lookup is successful but returns an empty value for "name"
                        this._error = 'Reverse geocode lookup failed. Unknown error.';
                        this._setLoaderError();

                        return;
                    }

                    this.location = location;
                } catch (err) {
                    this._error = err;
                    this._setLoaderError();
                }
            });


        const forecastDisplayModeToggle = this.shadowRoot.querySelector('#forecastDisplayModeToggle');
        forecastDisplayModeToggle && forecastDisplayModeToggle.addEventListener('zooduck-icon-toggle:change', () => {
            const forecastCarousel = this.shadowRoot.querySelector('#forecastCarousel') as HTMLZooduckCarouselElement;
            this._toggleForecastDisplayMode();
            forecastCarousel.updateCarouselHeight();
        });

        const mapDisplayToggle = this.shadowRoot.querySelector('#mapDisplayToggle');
        mapDisplayToggle && mapDisplayToggle.addEventListener('zooduck-icon-toggle:change', () => {
            this._toggleMapDisplayMode();
        });

        const forecastCarousel = this.shadowRoot.querySelector('#forecastCarousel') as HTMLElement;
        forecastCarousel && this._registerEventsOnCarousel(forecastCarousel);

        const clubListCarousel = this.shadowRoot.querySelector('#clubListCarousel') as HTMLElement;
        clubListCarousel && this._registerEventsOnCarousel(clubListCarousel);
    }

    private _registerEventsOnCarousel(carousel: HTMLElement): void {
        if ('PointerEvent' in window) {
            carousel.addEventListener('pointerdown', (e: PointerEvent) => {
                const eventDetails = this._pointerEventDetails.fromPointer(e);
                this._pointerEvents.pointerdown.push(eventDetails);

                this._blurSearchInput();
            });
        } else if ('TouchEvent' in window) {
            carousel.addEventListener('touchstart', (e: TouchEvent) => {
                const eventDetails = this._pointerEventDetails.fromTouch(e);
                this._pointerEvents.pointerdown.push(eventDetails);

                this._blurSearchInput();
            });
        } else {
            carousel.addEventListener('mousedown', (e: MouseEvent) => {
                const eventDetails = this._pointerEventDetails.fromMouse(e);
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
        } else if ('TouchEvent' in window) {
            clubListItemName.addEventListener('touchend', (e: TouchEvent) => {
                const pointerupEventDetails = this._pointerEventDetails.fromTouch(e);
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
        }
    }

    private _resetLoaderMessages() {
        Array.from(Object.keys(this._loaderMessageElements)).forEach((key: string) => {
            this._loaderMessageElements[key].innerHTML = '';
        });
    }

    private _revertContent() {
        console.error(this._error); // eslint-disable-line no-console

        if (!this._hasLoaded) {
            this._setBasicContent();

            return;
        }

        if (this._error) {
            this._setLoaderError();

            return;
        }

        this._setReady();
    }

    private async _setBasicContent() {
        if (this._hasLoaded) {
            return;
        }

        await this._onFirstLoad();

        if (this._error) {
            this._setLoaderError();
        }

        const weatherElements: WeatherElements = new SkyduckWeatherElements(
            this._locationDetails,
            this._forecast,
            this._googleMapsKey,
            this._version,
            this._clubsSortedByCountry,
            this._nearestClub,
            this._position,
            this._userDeniedGeolocation,
            this._forecastDisplayMode,
            this._mapDisplayMode,
        );

        const {
            header,
            search,
            clubList,
        } = weatherElements;

        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(search);
        this.shadowRoot.appendChild(clubList);

        this._registerEvents();

        if (!this._hasLoaded) {
            this.dispatchEvent(new CustomEvent('load'));
        }

        this._hasLoaded = true;

        if (this._error) {
            return;
        }

        this._setReady();
    }

    private _setClubToSelectedClubFromList(clubListItem: HTMLElement) {
        const clubName = clubListItem.querySelector('.club-list-item__name').innerHTML;
        this.club = clubName;
    }

    private async _setContent() {
        if (!this._hasLoaded) {
            await this._onFirstLoad();
        }

        if (!this._imagesReady) {
            await this._getImages();
        }

        if (this._hasLoaded) {
            this._clearContent();
            await this._setLoaderInfoDisplay();
        }

        const weatherElements: WeatherElements = new SkyduckWeatherElements(
            this._locationDetails,
            this._forecast,
            this._googleMapsKey,
            this._version,
            this._clubsSortedByCountry,
            this._nearestClub,
            this._position,
            this._userDeniedGeolocation,
            this._forecastDisplayMode,
            this._mapDisplayMode,
        );

        const {
            clubList,
            controls,
            geolocationError,
            header,
            locationInfo,
            search,
            forecast,
            footer,
        } = weatherElements;

        this._setReady();

        if (this._userDeniedGeolocation) {
            this.shadowRoot.appendChild(geolocationError);
        }

        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(search);
        this.shadowRoot.appendChild(locationInfo);

        if (this._mapDisplayMode === 'on') {
            this._animateMap({
                hideMap: false,
                animationDuration: 0,
            });
        } else {
            this._animateMap({
                hideMap: true,
                animationDuration: 0,
            });
        }

        this.shadowRoot.appendChild(controls);
        this.shadowRoot.appendChild(forecast);

        this.shadowRoot.appendChild(footer);
        this.shadowRoot.appendChild(clubList);

        this._registerEvents();

        if (!this._hasLoaded) {
            this.dispatchEvent(new CustomEvent('load'));
        }

        this._hasLoaded = true;

        this._setLoaded();

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

    private async _setLoaded(noDelay?: boolean) {
        const contentLoadTimeInMillis = noDelay
            ? 0
            : 250;

        await wait(contentLoadTimeInMillis);

        this.classList.remove(this._modifierClasses.loading);
        this._clearLoaderInfoDisplay();
    }

    private _setLoading() {
        this.classList.remove(this._modifierClasses.ready);
        this.classList.add(this._modifierClasses.loading);
    }

    private _setReady() {
        this.classList.remove(this._modifierClasses.error);
        this.classList.remove(this._modifierClasses.init);

        this.classList.add(this._modifierClasses.ready);

        if (this._forecastDisplayMode === '24h') {
            this.classList.add(this._modifierClasses.forecastDisplayMode24h);
        }
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

    private _toggleForecastDisplayMode(): void {
        this._forecastDisplayMode = this._forecastDisplayMode === '24h'
            ? '3h'
            : '24h';

        this.classList.toggle(this._modifierClasses.forecastDisplayMode24h);
    }

    private _toggleMapDisplayMode(): void {
        this._mapDisplayMode = this._mapDisplayMode === 'on'
            ? 'off'
            : 'on';

        this._animateMap({
            hideMap: this._mapDisplayMode === 'off',
        });
    }

    protected async _init(): Promise<void> {
        this.classList.add(this._modifierClasses.init);
        this.classList.add(this._modifierClasses.loading);

        if (!this._club && !this._location) {
            await this._initClubs();

            this.club = this._nearestClub
                ? this._nearestClub.name
                : this._defaultClub;
        }
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
    }
}

customElements.define(tagName, HTMLSkyDuckElement);
