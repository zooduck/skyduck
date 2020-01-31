/* eslint-disable no-unused-vars */
import {
    ModifierClasses,
    GeocodeData,
    StateActions,
} from './interfaces/index';
/* eslint-enable no-unused-vars */
import { reverseGeocodeLookup } from './fetch/reverse-geocode-lookup.fetch';
import { skydiveClubsLookup } from './fetch/skydive-clubs.fetch';
import { getCurrentPosition } from './utils/get-current-position';
import { Log } from './fetch/log.fetch';
import { modifierClasses } from './utils/modifier-classes';
import { state } from './state/state';
import { StateAPotamus } from './state/stateapotamus';
import { googleMapsKeyLookup } from './fetch/google-maps-key-lookup.fetch';
import { stateActions } from './state/state-actions';

const tagName = 'zooduck-skyduck';

/* eslint-enable */
class HTMLZooduckSkyduckElement extends HTMLElement {
    private _club: string;
    private _defaultClub: string;
    private _location: string;
    private _modifierClasses: ModifierClasses;

    constructor () {
        super();

        this.attachShadow({ mode: 'open' });

        this._defaultClub = 'Skydive Algarve';
        this._modifierClasses = modifierClasses;

        StateAPotamus.setState({
            ...state,
        });

        this._registerActions();
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

            this._init().then(() => {
                StateAPotamus.dispatch('CLUB_CHANGE', {
                    club: this._club,
                });
            });
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

            this._init().then(() => {
                StateAPotamus.dispatch('LOCATION_CHANGE', {
                    club: '',
                    currentClub: null,
                    location: this._location,
                });
            });
        }
    }

    private async _initClubs(): Promise<void> {
        const { clubs } = StateAPotamus.getState();

        if (clubs) {
            return;
        }

        try {
            const clubs = await skydiveClubsLookup();

            StateAPotamus.dispatch('SORT_CLUBS', {
                clubs,
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    }

    private _logConnection() {
        try {
            const { userLocation } = StateAPotamus.getState();

            if (!userLocation) {
                return;
            }

            const log = new Log(userLocation.name);

            log.connection();
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
        }
    }

    private _syncStringAttr(name: string, val: string) {
        if (this.getAttribute(name) === val) {
            return;
        }

        this.setAttribute(name, val);
    }

    protected async _init(): Promise<void> {
        const { hasLoaded, setupStarted } = StateAPotamus.getState();

        if (hasLoaded || setupStarted) {
            return;
        }

        await this._setup();

        this.classList.add(this._modifierClasses.init);

        StateAPotamus.dispatch('SET_LOADING', {
            isLoading: true,
        });

        this._initClubOrLocation();
    }

    private _initClubOrLocation() {
        if (this._club || this._location) {
            return;
        }

        const { nearestClub, userLocation } = StateAPotamus.getState();

        if (!nearestClub && userLocation) {
            this.location = userLocation.name;

            return;
        }

        this.club = nearestClub
            ? nearestClub.name
            : this._defaultClub;
    }

    protected _registerActions() {
        const actions: StateActions = stateActions.call(this);

        Object.keys(actions).forEach((action: string) => {
            const actionCallback: CallableFunction = actions[action];

            StateAPotamus.listen(action, actionCallback);
        });
    }

    protected async _setup(): Promise<void> {
        const { setupStarted } = StateAPotamus.getState();

        if (setupStarted) {
            return;
        }

        const versionResponse = await fetch('/version');
        const version =  await versionResponse.text();
        const googleMapsKey = await googleMapsKeyLookup();

        try {
            const position = await getCurrentPosition();

            StateAPotamus.dispatch('SET_POSITION', {
                position,
            });

            const { coords } = StateAPotamus.getState().position;
            const geocodeData: GeocodeData = await reverseGeocodeLookup(coords);

            StateAPotamus.dispatch('USER_LOCATION_CHANGE', {
                userLocation: geocodeData,
                userDeniedGeolocation: false,
            });

            this._logConnection();
        } catch (err) {
            console.warn(err); // eslint-disable-line no-console

            StateAPotamus.dispatch('USER_DENIED_GEOLOCATION', {
                userDeniedGeolocation: true,
            });
        }

        await this._initClubs();

        StateAPotamus.dispatch('SETUP', {
            version: version.split('-')[0],
            googleMapsKey,
            setupStarted: true,
        });
    }

    protected attributeChangedCallback(name: string, _oldVal: any, newVal: any) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }

    protected async connectedCallback() {
        if (!this._club && !this._location) {
            await this._init();
        }
    }
}

customElements.define(tagName, HTMLZooduckSkyduckElement);
