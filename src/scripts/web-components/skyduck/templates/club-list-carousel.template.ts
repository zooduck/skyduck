import { ClubListTemplate } from './club-list.template';
import { SkydiveClub, ClubListsSortedByCountry } from '../interfaces/index'; // eslint-disable-line no-unused-vars

type ClubListCountries = string[];

export class ClubListCarouselTemplate {
    private _clubs: ClubListsSortedByCountry;
    private _clubListCarousel: HTMLElement;
    private _nearestClub: SkydiveClub;
    private _position: Position;

    constructor(clubs: ClubListsSortedByCountry, nearestClub: SkydiveClub, position: Position) {
        this._clubs = clubs;
        this._nearestClub = nearestClub;
        this._position = position;

        this._buildClubListCarousel();
    }

    private _buildClubListCarousel(): void {
        this._clubListCarousel = new DOMParser().parseFromString(`
            <zooduck-carousel id="clubListCarousel">
                <div slot="slides"></div>
            </zooduck-carousel>
        `, 'text/html').body.firstChild as HTMLElement;

        const slidesSlot = this._clubListCarousel.querySelector('[slot=slides]');
        const slides = this._buildClubListContainers();

        slides.forEach((slide: HTMLElement) => {
            slidesSlot.appendChild(slide);
        });
    }

    private _buildClubListContainers(): HTMLElement[] {
        const clubListCountries = this._getClubListCountries();
        const clubListContainers = clubListCountries.map((country) => {
            return new ClubListTemplate(this._clubs[country], this._position).html;
        });

        return clubListContainers;
    }

    private _getClubListCountries(): ClubListCountries {
        const clubListCountries = Object.keys(this._clubs);

        if (!this._nearestClub) {
            return clubListCountries;
        }

        const nearestCountryIndex = clubListCountries.findIndex((country: string) => {
            return country === this._nearestClub.country;
        });

        const nearestCountryKey = clubListCountries.splice(nearestCountryIndex, 1)[0];

        clubListCountries.unshift(nearestCountryKey);

        return clubListCountries;
    }

    public get html(): HTMLElement {
        return this._clubListCarousel;
    }
}
