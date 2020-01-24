import { LocationDetails } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { NotFoundTemplate } from './not-found.template';
import { formatAddress } from '../utils/format-address';

export class LocationInfoTemplate {
    private _className: string;
    private _id: string;
    private _locationDetails: LocationDetails;
    private _locationInfo: HTMLElement;

    constructor(locationDetails: LocationDetails, id?: string, className?: string) {
        this._locationDetails = locationDetails;
        this._id = id;
        this._className = className || '';

        this._buildLocationInfo();
    }

    private _buildLocationInfo(): void {
        if (!this._locationDetails) {
            this._locationInfo = new NotFoundTemplate('LOCATION_DETAILS_NOT_FOUND').html;

            return;
        }

        const { name, address, site } = this._locationDetails;
        const title = `
            <h3>${name}</h3>
        `;
        const formattedAddress = formatAddress(address);
        const siteLink = site
            ? `
                <a
                    class="location-info-link"
                    href=${site}
                    target="_blank">
                    ${site.replace(/^https?:\/+/, '')}
                </a>
            `
            : '';

        this._locationInfo = new DOMParser().parseFromString(`
            <div class="location-info ${this._className}">
                ${title}
                ${formattedAddress}
                ${siteLink}
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (this._id) {
            this._locationInfo.setAttribute('id', this._id);
        }
    }

    public get html(): HTMLElement {
        return this._locationInfo;
    }
}
