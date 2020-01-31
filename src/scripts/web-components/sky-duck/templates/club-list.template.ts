import { SkydiveClub, ClubListSorted, GeocodeData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { ClubListItemTemplate } from './club-list-item.template';

export class ClubListTemplate {
    private _clubs: ClubListSorted;
    private _clubList: HTMLElement;
    private _eventHandler: CallableFunction;
    private _userLocation: GeocodeData;

    constructor(
        clubListSorted: ClubListSorted,
        userLocation: GeocodeData,
        eventHandler?: CallableFunction) {
        this._clubs = clubListSorted;
        this._userLocation = userLocation;
        this._eventHandler = eventHandler;

        this._buildClubList();
    }

    private _buildClubList(): void {
        const { country } = this._clubs;

        this._clubList = new DOMParser().parseFromString(`
            <div
                class="club-list-container"
                id="clubList_${country}">
                <ul class="club-list-container__club-list"></ul>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._clubs.list.map((club: SkydiveClub) => {
            return new ClubListItemTemplate(
                this._clubs,
                club,
                this._userLocation,
                this._eventHandler
            ).html;
        }).forEach((clubListItem: HTMLElement) => {
            const ul = this._clubList.querySelector('.club-list-container__club-list');
            ul.appendChild(clubListItem);
        });
    }

    public get html(): HTMLElement  {
        return this._clubList;
    }
}
