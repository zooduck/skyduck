import { SkydiveClub, ClubListSorted } from '../interfaces/index'; // eslint-disable-line no-unused-vars
export class ClubListItemTemplate {
    private _club: SkydiveClub;
    private _clubs: ClubListSorted;
    private _clubListItem: HTMLElement;
    private _position: Position;

    constructor(clubs: ClubListSorted, club: SkydiveClub, position: Position) {
        this._club = club;
        this._clubs = clubs;
        this._position = position;

        this._buildClubListItem();
    }

    private _buildClubListItem(): void {
        const { furthestDZDistance } = this._clubs;
        const distanceFromCurrentLocation = this._club.distance;
        const clubListItemDistanceStyle = `
            ${!this._position ? 'display: none;' : ''}
            grid-template-columns: minmax(auto, ${Math.round((this._club.distance / furthestDZDistance) * 100)}%) auto;
        `;
        const distanceColorModifier = distanceFromCurrentLocation >= 200
            ? '--red'
            : distanceFromCurrentLocation >= 100
                ? '--amber'
                : '--green';
        this._clubListItem = new DOMParser().parseFromString(`
            <li class="club-list-item">
                <div class="club-list-item-distance" style="${clubListItemDistanceStyle}">
                    <span class="club-list-item-distance__marker ${distanceColorModifier}"></span>
                    <div class="club-list-item-distance__miles">
                        <span>${distanceFromCurrentLocation}</span>
                        <small>miles</small>
                    </div>
                </div>
                <h3 class="club-list-item__name">${this._club.name}</h3>
                <span class="club-list-item__place">${this._club.place}</span>
                <a class="club-list-item__site-link" href="${this._club.site}" target="_blank">${this._club.site.replace(/https?:\/\//, '')}</a>
            </li>`, 'text/html').body.firstChild as HTMLElement;
    }


    public get html(): HTMLElement {
        return this._clubListItem;
    }
}