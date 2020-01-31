import { ClubListTemplate } from './club-list.template';
import { ClubListsSortedByCountry, ClubCountries, GeocodeData } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class ClubListCarouselTemplate {
    private _clubChangeHandler: CallableFunction;
    private _clubCountries: ClubCountries;
    private _clubs: ClubListsSortedByCountry;
    private _clubListCarousel: HTMLElement;
    private _slideChangeEventHandler: CallableFunction;
    private _userLocation: GeocodeData;

    constructor(
        clubListsSortedByCountry: ClubListsSortedByCountry,
        clubCountries: ClubCountries,
        userLocation: GeocodeData,
        slideChangeEventHandler?: CallableFunction,
        clubChangeHandler?: CallableFunction) {
        this._clubs = clubListsSortedByCountry;
        this._clubCountries = clubCountries;
        this._userLocation = userLocation;
        this._slideChangeEventHandler = slideChangeEventHandler;
        this._clubChangeHandler = clubChangeHandler;

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

        if (!this._slideChangeEventHandler) {
            return;
        }

        this._clubListCarousel.addEventListener('slidechange', (e: CustomEvent) => {
            this._slideChangeEventHandler(e);
        });
    }

    private _buildClubListContainers(): HTMLElement[] {
        const clubListContainers = this._clubCountries.map((country) => {
            return new ClubListTemplate(
                this._clubs[country],
                this._userLocation,
                this._clubChangeHandler
            ).html;
        });

        return clubListContainers;
    }

    public get html(): HTMLElement {
        return this._clubListCarousel;
    }
}
