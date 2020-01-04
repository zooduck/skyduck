import { GoogleMapTemplate } from './google-map.template';
import { PlaceTemplate } from './place.template';
import { LocalTimeAndUnitsInfoTemplate } from './local-time-and-units-info.template';
import { LocationDetails } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { NotFoundTemplate } from './not-found.template';

export class LocationInfoTemplate {
    private _googleMapsKey: string;
    private _locationDetails: LocationDetails;
    private _locationInfo: HTMLElement;

    constructor(locationDetails: LocationDetails, googleMapsKey) {
        this._googleMapsKey = googleMapsKey;
        this._locationDetails = locationDetails;

        this._buildLocationInfo();
    }

    private _buildLocationInfo(): void {
        if (!this._locationDetails) {
            this._locationInfo = new NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND').html;

            return;
        }

        this._locationInfo = document.createElement('div') as HTMLElement;
        this._locationInfo.className = 'club-info-grid';

        const { coords, timezone } = this._locationDetails;

        this._locationInfo.appendChild(new GoogleMapTemplate(this._googleMapsKey, coords).html);
        this._locationInfo.appendChild(new PlaceTemplate(this._locationDetails).html);
        this._locationInfo.appendChild(new LocalTimeAndUnitsInfoTemplate(timezone).html);
    }

    public get html(): HTMLElement {
        return this._locationInfo;
    }
}
