import { SkyduckStyle } from './services/skyduck-style';
import { SkyduckElements } from './services/skyduck-elements';
import { SkyduckWeather } from './services/skyduck-weather';
/* eslint-disable */
import {
    ModifierClasses,
    WeatherElements,
    DailyForecast,
    GeocodeData,
    SkydiveClub,
    ClubListsSortedByCountry,
    Coords,
    State,
    LoaderMessageElements,
    ClubCountries,
    StateChangeHandlers,
    HTMLZooduckCarouselElement,
} from './interfaces/index';
/* eslint-enable */
import { imageMap } from './utils/image-map';
import { wait } from './utils/wait/wait';
import { LoaderTemplate } from './templates/loader.template';
import { geocodeLookup } from './fetch/geocode-lookup.fetch';
import { reverseGeocodeLookup } from './fetch/reverse-geocode-lookup.fetch';
import { skydiveClubsLookup } from './fetch/skydive-clubs.fetch';
import { escapeSpecialChars } from './utils/escape-special-chars';
import { sortClubsByCountry } from './utils/sort-clubs-by-country';
import { getCurrentPosition } from './utils/get-current-position';
import { Log } from './fetch/log.fetch';
import { SettingsTemplate } from './templates/settings.template';
import { GlassTemplate } from './templates/glass.template';
import { loadImage } from './utils/load-image';
import {
    toggleSettings,
    toggleActiveCarousel,
    toggleForecastDisplayMode,
    reverseGeocodeLookupControl,
    onSearchSubmit
} from './event-handlers/index';
import { modifierClasses } from './utils/modifier-classes';
import { state } from './state/index';
import { setLoaderInfoDisplay } from './utils/set-loader-info-display';
import { clearLoaderInfoDisplay } from './utils/clear-loader-info-display';
import { googleMapsKeyLookup } from './fetch/google-maps-key-lookup.fetch';

const tagName = 'sky-duck';

/* eslint-enable */
class HTMLSkyDuckElement extends HTMLElement {
    private _club: string;
    private _clubCountries: ClubCountries;
    private _clubs: SkydiveClub[];
    private _clubsSortedByCountry: ClubListsSortedByCountry;
    private _defaultClub: string;
    private _error: string;
    private _forecast: DailyForecast;
    private _firstLoadDelayMillis: number;
    private _geocodeData: GeocodeData;
    private _imagesReady = false;
    private _loaderMessageElements: LoaderMessageElements;
    private _location: string;
    private _modifierClasses: ModifierClasses;
    private _nearestClub: SkydiveClub;
    private _onSearchSubmitHandler: EventListener;
    private _position: Position;
    private _reverseGeocodeLookupHandler: EventListener;
    private _state: State;
    private _style: SkyduckStyle;
    private _toggleActiveCarouselHandler: EventListener;
    private _toggleForecastDisplayModeHandler: EventListener;
    private _toggleSettingsHandler: EventListener;
    private _transitionSpeedInMillis: number;
    private _userLocation: GeocodeData;
    private _weather: SkyduckWeather;

    constructor () {
        super();

        this.attachShadow({ mode: 'open' });

        this._defaultClub = 'Skydive Algarve';
        this._firstLoadDelayMillis = 5000;
        this._modifierClasses = modifierClasses;
        this._transitionSpeedInMillis = 250;

        this._style = new SkyduckStyle({
            transitionSpeedInMillis: this._transitionSpeedInMillis,
        });
        this._weather = new SkyduckWeather();

        this._state = new Proxy({
            ...state,
        }, this._stateController());

        this._onSearchSubmitHandler = onSearchSubmit.bind(this);
        this._reverseGeocodeLookupHandler = reverseGeocodeLookupControl.bind(this);
        this._toggleSettingsHandler = toggleSettings.bind(this);
        this._toggleForecastDisplayModeHandler = toggleForecastDisplayMode.bind(this);
        this._toggleActiveCarouselHandler = toggleActiveCarousel.bind(this);
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
        if (this._club === val) {
            return;
        }

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
        if (this._location === val) {
            return;
        }

        this._location = val;
        this._syncStringAttr('location', this._location);

        if (val) {
            this.removeAttribute('club');
            this._onLocationChange();
        }
    }

    private _addSettings() {
        this.shadowRoot.appendChild(this._getGlass());
        this.shadowRoot.appendChild(this._getSettings());
    }

    private _addStyleAndLoader() {
        this.shadowRoot.appendChild(this._getStyle());
        this.shadowRoot.appendChild(this._getLoader());
    }

    private _clearLoaderInfoDisplay() {
        return clearLoaderInfoDisplay(this._loaderMessageElements);
    }

    private _clearContent(): void {
        const nodesToRemove = Array.from(this.shadowRoot.children).filter((child: HTMLElement) => {
            const isStyleTag = /style/i.test(child.nodeName);
            const isRenderOnce = child.classList.contains('--render-once');

            return !isStyleTag && !isRenderOnce;
        });

        nodesToRemove.forEach((node: HTMLElement) => {
            node.parentNode.removeChild(node);
        });

        this._resetLoaderMessages();
    }

    private _getClubCountries() {
        const clubListCountries = Object.keys(this._clubsSortedByCountry).filter((country: string) => {
            if (this._nearestClub) {
                return country !== this._nearestClub.country;
            }

            return true;
        });

        if (this._nearestClub) {
            clubListCountries.unshift(this._nearestClub.country);
        }

        return clubListCountries;
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
    }

    private _getGlass(): HTMLElement {
        return new GlassTemplate().html;
    }

    private async _getGoogleMapsKey(): Promise<string> {
        if (!this._state.googleMapsKey) {
            this._state.googleMapsKey = await googleMapsKeyLookup();
        }

        return this._state.googleMapsKey;
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
                    await loadImage(link.url);
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

        loader.addEventListener('click', () => {
            if (this._error) {
                this._setReady();
                this._setLoaded(true);
            }
        });

        this._loaderMessageElements = loaderTemplate.infoElements;

        return loader;
    }

    private _getSettings(): HTMLElement {
        const { googleMapsKey, settings, userDeniedGeolocation } = this._state;

        return new SettingsTemplate(googleMapsKey, settings, userDeniedGeolocation).html;
    }

    private _getStyle(): HTMLStyleElement {
        const styleEl = document.createElement('style');
        styleEl.textContent = this._style.style;

        return styleEl;
    }

    private async _onClubChange() {
        if (this._state.hasLoaded && this._state.isLoading) {
            return;
        }

        this._setLoading();
        this._state.isLoading = true;

        if (!this._clubs) {
            await this._initClubs();
        }

        if (!this._getClubData()) {
            this._error = `Could not find club "${this._club}" in the Skyduck database. Try searching by location instead.`;
            this._revertContentOnError();

            return;
        }

        try {
            await this._getForecast();
            this._error = null;
            this._setContent();
        } catch (err) {
            this._error = err;
            this._revertContentOnError();
        }
    }

    private async _onFirstLoad() {
        this._state.googleMapsKey =  await this._getGoogleMapsKey();

        this._addStyleAndLoader();
        this._addSettings();

        this._setLoaderBarSpeed(this._firstLoadDelayMillis);

        await this._initClubs();

        await wait(this._firstLoadDelayMillis);
    }

    private _onLocationChange() {
        if (this._state.hasLoaded && this._state.isLoading) {
            return;
        }

        this._setLoading();
        this._state.isLoading = true;


        geocodeLookup(this._location).then(async (response) => {
            this._geocodeData = response;

            try {
                await this._getForecast();
                this._error = null;
                this._setContent();
            } catch (err) {
                this._error = err;
                this._revertContentOnError();
            }
        }).catch((err) => {
            this._geocodeData = null;
            this._error = err;

            this._revertContentOnError();
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
                this._state.userDeniedGeolocation = false;
                this._userLocation = geocodeData;

                const { name: location } = geocodeData;
                const log = new Log(location);

                log.connection();
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
            this._state.userDeniedGeolocation = true;
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
            this._clubCountries = this._getClubCountries();
        } catch (err) {
            this._error = err;
            this._setLoaderError();
        }
    }

    private _registerEvents(): void {
        if (!this._error) {
            this._registerEventsOnForecastCarousels();
        }

        if (this._state.hasLoaded) {
            return;
        }

        this._registerEventsOnRenderOnceElements();
        this._registerEventsOnSettings();
    }

    private _registerEventsOnClubListItem(clubListItem: HTMLElement) {
        const clubListItemName = clubListItem.querySelector('.club-list-item__name');

        clubListItemName.addEventListener('click', () => {
            this._setClubToSelectedClubFromList(clubListItem);
        });
    }

    private _registerEventsOnForecastCarousels() {
        [
            this.shadowRoot.querySelector('#forecastCarouselStandard'),
            this.shadowRoot.querySelector('#forecastCarouselExtended'),
        ].forEach((forecastCarousel: HTMLZooduckCarouselElement) => {
            forecastCarousel.addEventListener('slidechange', (e: CustomEvent) => {
                const { id: slideNumber } = e.detail.currentSlide;

                this._state.currentForecastSlide = slideNumber;
            });
        });
    }

    private _registerEventsOnRenderOnceElements() {
        const settingsToggle = this.shadowRoot.querySelector('#settingsToggle');
        settingsToggle && settingsToggle.addEventListener('click', this._toggleSettingsHandler);

        const clubListCarousel = this.shadowRoot.querySelector('#clubListCarousel') as HTMLElement;
        clubListCarousel.addEventListener('slidechange', (e: CustomEvent) => {
            const { index: clubCountryIndex } = e.detail.currentSlide;
            const clubListCountry = this._clubCountries[clubCountryIndex];

            this._state.currentClubListCountry = clubListCountry;

            if (this._state.settings.activeCarousel !== 'club-list') {
                return;
            }

            this._state.headerTitle = clubListCountry;
        });
        const clubListItems = Array.from(clubListCarousel.querySelectorAll('.club-list-item'));
        clubListItems.forEach((clubListItem: HTMLElement) => {
            this._registerEventsOnClubListItem(clubListItem);
        });
    }

    private _registerEventsOnSettings(): void {
        this._settingsPageEvents().forEach((item) => {
            const el = this.shadowRoot.querySelector(item.selector);
            item.listeners.forEach((eventConfig) => {
                if (!el) {
                    return;
                }

                const { eventName, callback } = eventConfig;
                el.removeEventListener(eventName, callback);
                el.addEventListener(eventName, callback);
            });
        });
    }

    private _resetLoaderMessages() {
        Object.keys(this._loaderMessageElements).forEach((key: string) => {
            this._loaderMessageElements[key].innerHTML = '';
        });
    }

    private _resetModifierClasses() {
        const excludedClasses = [
            this._modifierClasses.userDeniedGeolocation,
            this._modifierClasses.settingsActive,
            this._modifierClasses.loading,
        ];

        Object.keys(this._modifierClasses).forEach((key: string) => {
            const modifierClassToRemove = this._modifierClasses[key];

            if (excludedClasses.includes(modifierClassToRemove)) {
                return;
            }

            this.classList.remove(modifierClassToRemove);
        });

        this.classList.add(`--active-carousel-${this._state.settings.activeCarousel}`);
        this.classList.add(`--forecast-display-mode-${this._state.settings.forecastDisplayMode}`);
    }

    private _revertContentOnError() {
        console.error(this._error); // eslint-disable-line no-console

        if (this._state.hasLoaded) {
            this._setLoaderError();

            return;
        }

        this._setBasicContentOnError();
    }

    private async _setBasicContentOnError() {
        if (this._state.hasLoaded) {
            return;
        }

        await this._onFirstLoad();

        this._setLoaderError();

        const weatherElements: WeatherElements = new SkyduckElements(
            this._state.settings.locationDetails,
            this._state.currentForecastSlide,
            this._forecast,
            this._state.version,
            this._clubsSortedByCountry,
            this._clubCountries,
            this._position,
            this._userLocation,
        );

        const {
            header,
            headerPlaceholder,
            clubList,
        } = weatherElements;

        this.shadowRoot.appendChild(headerPlaceholder);
        this.shadowRoot.appendChild(header);
        this.shadowRoot.appendChild(clubList);

        this._registerEvents();

        this._state.settings.activeCarousel = 'club-list';

        if (!this._state.hasLoaded) {
            this.dispatchEvent(new CustomEvent('load'));
        }

        this._state.hasLoaded = true;
    }

    private _setClubToSelectedClubFromList(clubListItem: HTMLElement) {
        const clubName = clubListItem.querySelector('.club-list-item__name').innerHTML;
        this.club = clubName;
    }

    private async _setContent() {
        if (!this._state.hasLoaded) {
            await this._onFirstLoad();
        }

        if (!this._imagesReady) {
            await this._getImages();
        }

        if (this._state.hasLoaded) {
            this._clearContent();

            try {
                await this._setLoaderInfoDisplay();
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }

        }

        const weatherElements: WeatherElements = new SkyduckElements(
            this._state.settings.locationDetails,
            this._state.currentForecastSlide,
            this._forecast,
            this._state.version,
            this._clubsSortedByCountry,
            this._clubCountries,
            this._position,
            this._userLocation,
        );

        const {
            forecast,
            forecastExtended,
            footer,
        } = weatherElements;

        this._setReady();

        if (!this._state.hasLoaded) {
            const { headerPlaceholder, header, clubList } = weatherElements;

            this.shadowRoot.appendChild(headerPlaceholder);
            this.shadowRoot.appendChild(header);
            this.shadowRoot.appendChild(clubList);
        }

        this.shadowRoot.appendChild(forecast);
        this.shadowRoot.appendChild(forecastExtended);
        this.shadowRoot.appendChild(footer);

        if (this._state.hasLoaded) {
            this._state.settings.activeCarousel = 'forecast';
        }

        this._registerEvents();

        if (!this._state.hasLoaded) {
            this.dispatchEvent(new CustomEvent('load'));
        }

        await this._setLoaded();

        this._state.hasLoaded = true;
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

    private _setLoaderInfoDisplay(): Promise<void> {
        return setLoaderInfoDisplay(this._forecast, this._getClubData(), this._loaderMessageElements);
    }

    private async _setLoaded(noDelay = false) {
        const contentLoadTimeInMillis = noDelay
            ? 0
            : 250;

        await wait(contentLoadTimeInMillis);

        this.classList.remove(this._modifierClasses.loading);
        this._clearLoaderInfoDisplay();

        this._state.isLoading = false;
    }

    private _setLoading() {
        this.classList.remove(this._modifierClasses.ready);
        this.classList.add(this._modifierClasses.loading);
    }

    private _setLocationDetails(name: string, address: string, site: string, timezone: string, coords: Coords): void {
        this._state.settings.locationDetails = {
            name,
            address,
            site,
            timezone,
            coords,
        };
    }

    private async _setReady() {
        this._resetModifierClasses();

        this.classList.add(this._modifierClasses.ready);
    }

    private _settingsPageEvents() {
        return [
            {
                selector: '#settingsGlass',
                listeners: [
                    { eventName: 'click', callback: this._toggleSettingsHandler },
                ],
            },
            {
                selector: '#forecastDisplayModeSetting zooduck-icon-toggle',
                listeners: [
                    { eventName: 'click', callback: this._toggleForecastDisplayModeHandler },
                ],
            },
            {
                selector: '#activeCarouselSetting zooduck-icon-toggle',
                listeners: [
                    { eventName: 'click', callback: this._toggleActiveCarouselHandler },
                ],
            },
            {
                selector: '#searchInput',
                listeners: [
                    { eventName: 'keyup:enter', callback: this._onSearchSubmitHandler },
                ],
            },
            {
                selector: '#useCurrentLocationControl',
                listeners: [
                    { eventName: 'click', callback: this._reverseGeocodeLookupHandler },
                ],
            },
        ];
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

    private async _updateForecastCarousels(slideNumber: number) {
        [
            this.shadowRoot.querySelector('#forecastCarouselStandard'),
            this.shadowRoot.querySelector('#forecastCarouselExtended'),
        ].forEach((forecastCarousel: HTMLZooduckCarouselElement) => {
            forecastCarousel.currentslide = slideNumber;
        });
    }

    private _updateHeaderTitle(val: string) {
        const headerTitle = this.shadowRoot.querySelector('#headerTitle');
        headerTitle.innerHTML = val;
    }

    private async _updateSettingsPage(prop: string) {
        const settingsPage = this.shadowRoot.querySelector('#settings');

        if (!settingsPage || !this._state.settings.locationDetails) {
            return;
        }

        const newSettings = new SettingsTemplate(
            this._state.googleMapsKey,
            this._state.settings,
            this._state.userDeniedGeolocation);

        switch (prop) {
        case 'locationDetails':
            settingsPage.querySelector('#map').replaceWith(newSettings.map);
            settingsPage.querySelector('#locationInfo').replaceWith(newSettings.locationInfo);

            break;
        case 'activeCarousel':
            await wait(this._transitionSpeedInMillis); // let the zooduck-icon-toggle animation complete

            settingsPage.querySelector('#activeCarouselSetting').replaceWith(newSettings.activeCarouselToggle);

            this._registerEventsOnSettings();

            break;
        case 'forecastDisplayMode':
            await wait(this._transitionSpeedInMillis); // let the zooduck-icon-toggle animation complete

            settingsPage.querySelector('#forecastDisplayModeSetting').replaceWith(newSettings.extendedForecastToggle);

            this._registerEventsOnSettings();

            break;
        case 'settingsActive':
            this.classList.toggle('--settings-active');

            break;
        default: // do nothing
        }
    }

    protected async _init(): Promise<void> {
        this.classList.add(this._modifierClasses.init);

        this._setLoading();

        if (!this._club && !this._location) {
            await this._initClubs();

            this.club = this._nearestClub
                ? this._nearestClub.name
                : this._defaultClub;
        }
    }

    protected _stateChangeHandlers(): StateChangeHandlers {
        return {
            activeCarousel: async (prop: string, val: string) => {
                this._updateSettingsPage(prop);

                this.classList.remove(this._modifierClasses.activeCarouselForecast);
                this.classList.remove(this._modifierClasses.activeCarouselClubList);

                const { activeCarousel } = this._state.settings;

                this.classList.add(`--active-carousel-${activeCarousel}`);

                this._state.headerTitle = val === 'club-list'
                    ? this._state.currentClubListCountry
                    : this._state.settings.locationDetails.name;
            },
            currentForecastSlide: async (val: number) => {
                this._updateForecastCarousels(val);
            },
            forecastDisplayMode: async (prop: string) => {
                this._updateSettingsPage(prop);

                this.classList.remove(this._modifierClasses.forecastDisplayModeExtended);
                this.classList.remove(this._modifierClasses.forecastDisplayModeStandard);

                const { forecastDisplayMode } = this._state.settings;

                this.classList.add(`--forecast-display-mode-${forecastDisplayMode}`);
            },
            headerTitle: async (val: string) => {
                this._updateHeaderTitle(val);
            },
            locationDetails: async (prop: string) => {
                this._updateSettingsPage(prop);
            },
            settingsActive: async (prop: string) => {
                this._updateSettingsPage(prop);
            }
        };
    }

    protected _stateController(): any {
        return {
            get: (obj: any, prop: any) => {
                if (typeof(obj[prop]) === 'object' && obj[prop] !== null) {
                    return new Proxy(obj[prop], this._stateController());
                }

                return Reflect.get(obj, prop);
            },
            set: (obj: any, prop: any, newVal: any) => {
                Reflect.set(obj, prop, newVal);

                this._updateState(prop, newVal);

                return true;
            }
        };
    }

    protected async _updateState(prop: string, val: any) {
        switch (prop) {
        case 'locationDetails':
            this._stateChangeHandlers().locationDetails(prop);

            break;
        case 'activeCarousel':
            await this._stateChangeHandlers().activeCarousel(prop, val);

            break;
        case 'currentForecastSlide':
            this._stateChangeHandlers().currentForecastSlide(val);

            break;
        case 'forecastDisplayMode':
            this._stateChangeHandlers().forecastDisplayMode(prop);

            break;
        case 'settingsActive':
            this._stateChangeHandlers().settingsActive(prop);

            break;
        case 'headerTitle':
            this._stateChangeHandlers().headerTitle(val);

            break;
        default: // do nothing
        }
    }

    protected attributeChangedCallback(name: string, _oldVal: any, newVal: any) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }

    protected async connectedCallback() {
        const versionResponse = await fetch('/version');
        this._state.version = await versionResponse.text();

        await this._init();
    }
}

customElements.define(tagName, HTMLSkyDuckElement);
