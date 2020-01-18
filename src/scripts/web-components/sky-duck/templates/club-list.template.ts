import { SkydiveClub, ClubListSorted, GeocodeData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { ClubListItemTemplate } from './club-list-item.template';

export class ClubListTemplate {
    private _clubs: ClubListSorted;
    private _clubList: HTMLElement;
    private _position: Position;
    private _userLocation: GeocodeData;

    constructor(clubs: ClubListSorted, position: Position, userLocation: GeocodeData) {
        this._clubs = clubs;
        this._position = position;
        this._userLocation = userLocation;

        this._buildClubList();
    }

    private _buildClubList(): void {
        const { country } = this._clubs;
        const clubList = new DOMParser().parseFromString(`
            <div
                class="club-list-container"
                id="clubList${country}">
                <ul class="club-list-container__club-list"></ul>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._clubs.list.map((club: SkydiveClub) => {
            return new ClubListItemTemplate(this._clubs, club, this._position, this._userLocation).html;
        }).forEach((clubListItem: HTMLElement) => {
            const ul = clubList.querySelector('.club-list-container__club-list');
            ul.appendChild(clubListItem);
        });

        this._clubList = clubList;
    }

    public get html(): HTMLElement  {
        return this._clubList;
    }
}
