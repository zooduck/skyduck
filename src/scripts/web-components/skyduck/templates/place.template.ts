import { LocationDetails } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class PlaceTemplate {
    private _locationDetails: LocationDetails;
    private _place: HTMLElement;

    constructor(locationDetails: LocationDetails) {
        this._locationDetails = locationDetails;

        this._buildPlace();
    }

    private _buildPlace(): void {
        const { name, address, site } = this._locationDetails;
        const title = `
            <h3>${name}</h3>
        `;
        const siteLink = site
            ? `<a class="club-info-grid-location-info__site-link" href="${site}" target="_blank">${site.replace(/https?:\/+/, '')}</a>`
            : '';
        this._place = new DOMParser().parseFromString(`
            <div class="club-info-grid-location-info">
                ${title}
                ${this._formatAddress(address)}
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
        return this._place;
    }
}
