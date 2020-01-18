import { LocationDetails } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { NotFoundTemplate } from './not-found.template';

export class LocationInfoTemplate {
    private _locationDetails: LocationDetails;
    private _locationInfo: HTMLElement;

    constructor(locationDetails: LocationDetails) {
        this._locationDetails = locationDetails;

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
        const formattedAddress = this._formatAddress(address);
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
            <div
                class="location-info"
                id="locationInfo">
                ${title}
                ${formattedAddress}
                ${siteLink}
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    private _formatAddress(address: string): string {
        const parts = address.split(',');
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

    public get html(): HTMLElement {
        return this._locationInfo;
    }
}
