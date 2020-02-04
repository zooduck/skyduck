import { ForecastTemplate } from './forecast.template';
import { DailyData, HTMLZooduckCarouselElement, ForecastType } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class ForecastCarouselTemplate {
    private _currentSlide: number;
    private _dailyData: DailyData[];
    private _eventHandler: CallableFunction;
    private _forecastHours: number[];
    private _forecastType: ForecastType;
    private _forecastCarousel: HTMLZooduckCarouselElement;

    constructor(
        dailyData: DailyData[],
        forecastHours: number[],
        forecastType: ForecastType,
        currentSlide: number,
        eventHandler?: CallableFunction) {
        this._dailyData = dailyData;
        this._forecastHours = forecastHours;
        this._forecastType = forecastType;
        this._currentSlide = currentSlide;
        this._eventHandler = eventHandler;

        this._buildForecastCarousel();
    }

    private _buildForecastCarousel(): void {
        const id = this._forecastType === 'extended'
            ? 'forecastCarouselExtended'
            : 'forecastCarouselStandard';
        const className = this._forecastType === 'extended'
            ? 'forecast-carousel-extended'
            : 'forecast-carousel-standard';

        this._forecastCarousel = new DOMParser().parseFromString(`
            <zooduck-carousel
                currentslide="${this._currentSlide}"
                id="${id}"
                class="${className}">
            </zooduck-carousel>
        `, 'text/html').body.firstChild as HTMLZooduckCarouselElement;

        const forecastSlides = this._dailyData.filter((dailyData: DailyData) => {
            return dailyData.hourly.length;
        }).map((dailyData: DailyData) => {
            return new ForecastTemplate(
                dailyData,
                this._forecastHours,
                this._forecastType,
            ).html;
        });

        const slidesSlot = this._buildSlidesSlot();

        forecastSlides.forEach((slide) => {
            slidesSlot.appendChild(slide);
        });

        this._forecastCarousel.appendChild(slidesSlot);

        if (!this._eventHandler) {
            return;
        }

        this._forecastCarousel.addEventListener('slidechange', (e: CustomEvent) => {
            this._eventHandler(e);
        });
    }

    private _buildSlidesSlot(): HTMLElement {
        return new DOMParser().parseFromString(`
            <div
                slot="slides"
                class="forecast-slides">
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLZooduckCarouselElement {
        return this._forecastCarousel;
    }
}
