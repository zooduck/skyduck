import { ForecastTemplate } from './forecast.template';
import { DailyData, HTMLZooduckCarouselElement, LocationDetails } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';
import { Hours } from '../utils/hours';

export class ForecastCarouselTemplate {
    private _dailyData: DailyData[];
    private _defaultForecastHours: number[];
    private _timezone: string;
    private _forecastCarousel: HTMLZooduckCarouselElement;
    private _locationDetails: LocationDetails;

    constructor(dailyData: DailyData[], defaultForecastHours: number[], timezone: string, locationDetails: LocationDetails) {
        this._dailyData = dailyData;
        this._defaultForecastHours = defaultForecastHours;
        this._locationDetails = locationDetails;
        this._timezone = timezone;

        this._buildForecastCarousel();
    }

    private _buildForecastCarousel(): void {
        const carousel = document.createElement('zooduck-carousel') as HTMLZooduckCarouselElement;
        carousel.setAttribute('id', 'forecastCarousel');

        const forecastSlides = this._dailyData.filter((dailyData: DailyData) => {
            return dailyData.hourly.length;
        }).map((dailyData: DailyData) => {
            return new ForecastTemplate(dailyData, this._defaultForecastHours, this._timezone, this._locationDetails).html;
        });

        const slidesSlot = document.createElement('div');
        slidesSlot.setAttribute('slot', 'slides');
        slidesSlot.className = 'forecast-slides';

        forecastSlides.forEach((slide) => {
            slidesSlot.appendChild(slide);
        });

        const slideSelectorsSlot = this._buildForecastSlideSelectorsSlot();

        carousel.appendChild(slideSelectorsSlot);
        carousel.appendChild(slidesSlot);

        carousel.addEventListener('slidechange', (e: CustomEvent) => {
            const { detail } = e;
            const slideSelectorSlots = Array.from(slideSelectorsSlot.children);
            slideSelectorSlots.forEach((slideSelector: HTMLElement, i: number) => {
                slideSelector.classList.remove('--active');

                if (i === detail.currentSlide.index) {
                    slideSelector.classList.add('--active');
                }
            });
        });

        this._forecastCarousel = carousel;
    }

    private _buildForecastSlideSelectorsSlot(): HTMLElement {
        const days = this._dailyData;

        const averageRatingTabs: HTMLElement[] = days.map((day) => {
            const daylightHours = new Hours(day, this._timezone).daylightHours;
            const averageRatingModifier = averageRatingModifierForDay(daylightHours);

            const forecastSlideSelector = new DOMParser().parseFromString(`
                <div class="forecast-slide-selectors__item ${averageRatingModifier}"></div>
            `, 'text/html').body.firstChild as HTMLElement;

            return forecastSlideSelector;
        });

        const forecastSlideSelectors = new DOMParser().parseFromString(`
            <div slot="slide-selectors" class="forecast-slide-selectors"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        averageRatingTabs.forEach((tab: HTMLElement) => {
            forecastSlideSelectors.appendChild(tab);
        });

        return forecastSlideSelectors;
    }


    public get html(): HTMLZooduckCarouselElement {
        return this._forecastCarousel;
    }

}
