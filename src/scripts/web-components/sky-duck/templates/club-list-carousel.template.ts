import { ClubListTemplate } from './club-list.template';
import { ClubListsSortedByCountry, ClubCountries, GeocodeData } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class ClubListCarouselTemplate {
    private _clubCountries: ClubCountries;
    private _clubs: ClubListsSortedByCountry;
    private _clubListCarousel: HTMLElement;
    private _position: Position;
    private _userLocation: GeocodeData;

    constructor(clubs: ClubListsSortedByCountry, clubCountries: ClubCountries, position: Position, userLocation: GeocodeData) {
        this._clubCountries = clubCountries;
        this._clubs = clubs;
        this._position = position;
        this._userLocation = userLocation;

        this._buildClubListCarousel();
    }

    private _buildClubListCarousel(): void {
        this._clubListCarousel = new DOMParser().parseFromString(`
            <zooduck-carousel
                id="clubListCarousel"
                class="club-list-carousel --render-once">
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
        const clubListContainers = this._clubCountries.map((country) => {
            return new ClubListTemplate(this._clubs[country], this._position, this._userLocation).html;
        });

        return clubListContainers;
    }

    public get html(): HTMLElement {
        return this._clubListCarousel;
    }
}
