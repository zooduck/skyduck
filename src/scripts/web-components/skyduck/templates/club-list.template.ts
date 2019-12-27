import { SkydiveClub, ClubListSorted } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { ClubListItemTemplate } from './club-list-item.template';

export class ClubListTemplate {
    private _clubs: ClubListSorted;
    private _clubList: HTMLElement;
    private _position: Position;

    constructor(clubs: ClubListSorted, position: Position) {
        this._clubs = clubs;
        this._position = position;

        this._buildClubList();
    }

    private _buildClubList(): void {
        const { country, list } = this._clubs;
        const numberOfClubs = list.length;
        const clubListCountry = `<h2 class="club-list-container__country">${country} (${numberOfClubs})</h2>`;
        const clubList = new DOMParser().parseFromString(`
            <div class="club-list-container" id="clubList${country}">
                ${clubListCountry}
                <ul class="club-list-container__club-list"></ul>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._clubs.list.map((club: SkydiveClub) => {
            return new ClubListItemTemplate(this._clubs, club, this._position).html;
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
