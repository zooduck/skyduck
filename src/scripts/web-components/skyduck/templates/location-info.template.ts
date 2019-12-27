import { GoogleMapTemplate } from './google-map.template';
import { PlaceTemplate } from './place.template';
import { LocalTimeAndUnitsInfoTemplate } from './local-time-and-units-info.template';
import { SkydiveClub, Coords } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class LocationInfoTemplate {
    private _club: SkydiveClub;
    private _coords: Coords;
    private _countryRegion: string;
    private _googleMapsKey: string;
    private _locationInfo: HTMLElement;
    private _timezone: string;

    constructor(club: SkydiveClub, countryRegion: string, timezone: string, coords: Coords, googleMapsKey: string) {
        this._club = club;
        this._coords = coords;
        this._countryRegion = countryRegion;
        this._googleMapsKey = googleMapsKey;
        this._timezone = timezone;

        this._buildLocationInfo();
    }

    private _buildLocationInfo(): void {
        this._locationInfo = document.createElement('div') as HTMLElement;
        this._locationInfo.className = 'club-info-grid';

        const { place: q } = this._club;

        this._locationInfo.appendChild(new GoogleMapTemplate(this._googleMapsKey, q, this._coords).html);
        this._locationInfo.appendChild(new PlaceTemplate(this._countryRegion, this._club).html);
        this._locationInfo.appendChild(new LocalTimeAndUnitsInfoTemplate(this._timezone).html);
    }

    public get html(): HTMLElement {
        return this._locationInfo;
    }
}
