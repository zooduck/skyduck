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

        this._buildClubListItem(club);
    }

    private _buildClubListItem(club: SkydiveClub): void {
        const { furthestDZDistance } = this._clubs;
        const distanceFromCurrentLocation = club.distance;
        const clubListItemDistanceStyle = `
            ${!this._position ? 'display: none;' : ''}
            grid-template-columns: minmax(auto, ${Math.round((club.distance / furthestDZDistance) * 100)}%) auto;
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
                <h3 class="club-list-item__name">${club.name}</h3>
                <span class="club-list-item__place">${club.place}</span>
                <a class="club-list-item__site-link" href="${club.site}" target="_blank">${club.site.replace(/https?:\/\//, '')}</a>
            </li>`, 'text/html').body.firstChild as HTMLElement;

        // const clubListItemName = clubListItem.querySelector('.club-list-item__name');

        // if ('PointerEvent' in window) {
        //     clubListItemName.addEventListener('pointerup', (e: PointerEvent) => {
        //         const pointerupEventDetails = this._pointerEventDetails.fromPointer(e);
        //         const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

        //         if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
        //             return;
        //         }

        //         this._setClubToSelectedClubFromList(clubListItem);
        //     });
        // } else {
        //     clubListItemName.addEventListener('mouseup', (e: MouseEvent) => {
        //         const pointerupEventDetails = this._pointerEventDetails.fromMouse(e);
        //         const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

        //         if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
        //             return;
        //         }

        //         this._setClubToSelectedClubFromList(clubListItem);
        //     });

        //     clubListItemName.addEventListener('touchend', (e: TouchEvent) => {
        //         const pointerupEventDetails = this._pointerEventDetails.fromTouch(e);
        //         const lastPointerdownEventDetails = this._pointerEvents.pointerdown.slice(-1)[0];

        //         if (!isTap(lastPointerdownEventDetails, pointerupEventDetails)) {
        //             return;
        //         }

        //         this._setClubToSelectedClubFromList(clubListItem);
        //     });
        // }

        // return clubListItem;
    }


    public get html(): HTMLElement {
        return this._clubListItem;
    }
}