import { HTMLZooduckCarouselElement } from '../../zooduck-carousel/zooduck-carousel.component'; // eslint-disable-line no-unused-vars
import { ForecastTemplate } from './forecast.template';
import { ForecastData } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { averageRatingModifierForDay } from '../utils/average-rating-modifier-for-day';

export class ForecastCarouselTemplate {
    private _dailyData: ForecastData[];
    private _defaultForecastHours: number[];
    private _timezone: string;
    private _forecastCarousel: HTMLZooduckCarouselElement;

    constructor(dailyData: ForecastData[], defaultForecastHours: number[], timezone: string) {
        this._dailyData = dailyData;
        this._defaultForecastHours = defaultForecastHours;
        this._timezone = timezone;

        this._buildForecastCarousel();
    }

    private _buildForecastCarousel(): void {
        const carousel = document.createElement('zooduck-carousel') as HTMLZooduckCarouselElement;
        carousel.setAttribute('id', 'forecastCarousel');

        const forecastSlides = this._dailyData.filter((dailyData: ForecastData) => {
            return dailyData.hourly.length;
        }).map((dailyData: ForecastData) => {
            return new ForecastTemplate(dailyData, this._defaultForecastHours, this._timezone).html;
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
            const averageRatingModifier = averageRatingModifierForDay(day.hourly);

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
