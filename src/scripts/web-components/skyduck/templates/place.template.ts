import { SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class PlaceTemplate {
    private _club: SkydiveClub;
    private _countryRegion: string;
    private _place: HTMLElement;

    constructor(countryRegion: string, club: SkydiveClub) {
        this._countryRegion = countryRegion;
        this._club = club;

        this._buildPlace();
    }

    private _formatPlace(place: string): string {
        const parts = place.split(',');
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

    private _buildPlace(): void {
        const name = this._countryRegion
            ? this._club.place.split(',')[0]
            : this._club.name;
        const place = this._countryRegion
            ? this._club.place.substr(name.length).concat(',').concat(this._countryRegion)
            : this._club.place;
        const title = `
            <h3>${name}</h3>
        `;
        const siteLink = this._club.site
            ? `<a class="club-info-grid-location-info__site-link" href="${this._club.site}" target="_blank">${this._club.site.replace(/https?:\/+/, '')}</a>`
            : '';
        this._place = new DOMParser().parseFromString(`
            <div class="club-info-grid-location-info">
                ${title}
                ${this._formatPlace(place)}
                ${siteLink}
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._place;
    }
}