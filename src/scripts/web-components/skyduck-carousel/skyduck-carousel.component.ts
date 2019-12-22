import { style } from './skyduck-carousel.style';
import { isTap } from './utils/is-tap';

interface Slide {
    id: number;
    index: number;
    el: HTMLElement;
}

interface TouchData {
    time: number;
    clientX: number;
    clientY: number;
}

interface PointerEvents {
    pointerdown: PointerEvent[];
}

const tagName = 'skyduck-carousel';

export class HTMLSkyduckCarouselElement extends HTMLElement {
    private _container: HTMLElement;
    private _currentOffsetX = 0;
    private _currentSlide: Slide;
    private _maxOffsetX = 0;
    private _pointerEvents: PointerEvents = {
        pointerdown: [],
    };
    private _scrollBehavior: 'auto'|'smooth' = 'smooth';
    private _slides: Slide[] = [];
    private _slidesSlot: HTMLSlotElement;
    private _slideSelectors: HTMLElement;
    private _slideSelectorsSlot: HTMLSlotElement;
    private _touchActive = false;
    private _touchMoveInProgress = false;
    private _touchStartData: TouchData = {
        time: 0,
        clientX: 0,
        clientY: 0,
    }
    private _transitionSpeedInMillis = 250;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        const styleEl = document.createElement('style');
        styleEl.textContent = style(this._transitionSpeedInMillis);

        this._slidesSlot = new DOMParser().parseFromString(`
            <slot name="slides"></slot>
        `, 'text/html').body.firstChild as HTMLSlotElement;

        this._slideSelectorsSlot = new DOMParser().parseFromString(`
            <slot name="slide-selectors"></slot>
        `, 'text/html').body.firstChild as HTMLSlotElement;

        this.shadowRoot.appendChild(styleEl);
        this.shadowRoot.appendChild(this._slideSelectorsSlot);
        this.shadowRoot.appendChild(this._slidesSlot);

        this._registerEvents();
    }

    static get observedAttributes(): string[] {
        return [
            'scrollbehavior',
        ];
    }

    private _getMaxNegativeOffsetX(): number {
        const slides = this._slides.slice(0, -1);

        let maxNegativeOffsetX = 0;
        slides.forEach(slide => maxNegativeOffsetX -= slide.el.offsetWidth);

        return maxNegativeOffsetX;
    }

    private _getPrecedingSlideWidths(nextSlide: Slide) {
        const precedingSlides = this._slides.filter((slide: Slide) => {
            return slide.index < nextSlide.index;
        });

        if (!precedingSlides.length) {
            return 0;
        }

        const precedingSlideWidths = precedingSlides.map((slide: Slide) => {
            return slide.el.offsetWidth;
        }).reduce((total: number, offsetWidth: number) => {
            return total + offsetWidth;
        });

        return precedingSlideWidths;
    }

    private _getSlideSelectorsHeight(): number {
        const slideSelectorsHeight = this._slideSelectors
            ? this._slideSelectors.offsetHeight
            : 0;

        return slideSelectorsHeight;
    }

    private _isDoubleTap(): boolean {
        if (this._pointerEvents.pointerdown.length < 2) {
            return false;
        }

        const secondToLastPointerdownTime = this._pointerEvents.pointerdown.slice(-2, -1)[0].timeStamp;
        const lastPointerdownTime = this._pointerEvents.pointerdown.slice(-1)[0].timeStamp;
        const maxTimeBetweenPointerDown = 250;

        return (lastPointerdownTime - secondToLastPointerdownTime) < maxTimeBetweenPointerDown;
    }

    private _isVerticalSwipe(verticalSwipePixels: number) {
        const maxVerticalSwipePixels = 50;

        return verticalSwipePixels > maxVerticalSwipePixels
            || verticalSwipePixels < (maxVerticalSwipePixels * -1);
    }

    private _onCurrentSlideChange(): void {
        this.dispatchEvent(new CustomEvent('slidechange', {
            detail: {
                currentSlide: this._currentSlide,
            },
        }));
    }

    private _onResize() {
        this._setTouchActive(true);
        this._setContainerStyle();
        this._slideIntoView(this._currentSlide);
    }

    private _onSwipeLeft() {
        const nextSlide = this._slides[this._currentSlide.index + 1];

        if (!nextSlide) {
            return;
        }

        this._setCurrentSlide(nextSlide.index);
        this._slideIntoView(nextSlide);
    }

    private _isSwipeValid(distance: number) {
        const minTravel = 50;

        return distance > minTravel || distance < (minTravel * -1);
    }

    private _onSwipeRight() {
        const nextSlide = this._slides[this._currentSlide.index - 1];

        if (!nextSlide) {
            return;
        }

        this._setCurrentSlide(nextSlide.index);
        this._slideIntoView(nextSlide);
    }

    private _onTouchStart(e: PointerEvent) {
        e.preventDefault();

        const clientX = e.clientX;
        const clientY = e.clientY;

        this._pointerEvents.pointerdown.push(e);

        const originalTarget = e.path
            ? e.path[0]
            : e.originalTarget;

        try {
            if (originalTarget.parentNode.getAttribute('slot') !== 'slide-selectors') {
                this._setTouchActive(true);
            }
        } catch (err) {
            this._setTouchActive(true);
        }

        this._touchStartData = {
            time: new Date().getTime(),
            clientX,
            clientY,
        };
    }

    private _onTouchMove(e: PointerEvent) {
        e.preventDefault();

        if (!this._touchActive) {
            return;
        }

        this._touchMoveInProgress = true;

        const clientX = e.clientX;
        const clientY = e.clientY;

        const verticalSwipePixels = this._touchStartData.clientY - clientY;

        if (this._isVerticalSwipe(verticalSwipePixels)) {
            this._setTouchActive(false);
            this._slideIntoView(this._currentSlide);

            return;
        }

        const swipeDistance = clientX - this._touchStartData.clientX;
        const currentX = parseInt((swipeDistance + this._currentOffsetX).toString(), 10);

        this._slideTo(currentX);
    }

    private _onTouchCancel(e: PointerEvent) {
        e.preventDefault();

        if (this._touchMoveInProgress) {
            this._setTouchActive(false);
            this._slideIntoView(this._currentSlide);
        }
    }

    private async _onTouchEnd(e: PointerEvent) {
        e.preventDefault();

        if (!this._touchActive) {
            return;
        }

        this._setTouchActive(false);

        const clientX = e.clientX;
        const distance = this._touchStartData.clientX - clientX;

        if (!this._isSwipeValid(distance)) {
            this._slideIntoView(this._currentSlide);

            return;
        }

        const direction = distance > 0 ? 'left' : 'right';

        if (direction === 'left') {
            this._onSwipeLeft();
        }

        if (direction === 'right') {
            this._onSwipeRight();
        }

        this._setCarouselHeightToSlideHeight();
        this.scrollIntoView({ behavior: this._scrollBehavior });
    }

    private _registerEvents() {
        window.addEventListener('resize', this._onResize.bind(this));

        this.onpointerdown = this._onTouchStart.bind(this);
        this.onpointermove = this._onTouchMove.bind(this);
        this.onpointerup = this._onTouchEnd.bind(this);
        this.onpointercancel = this._onTouchCancel.bind(this);

        this.addEventListener('pointerup', (e: PointerEvent) => {
            e.preventDefault();

            if (this._isDoubleTap() && this.offsetHeight >= window.innerHeight) {
                this.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    private _setCarouselHeightToSlideHeight() {
        this.style.height = `${this._currentSlide.el.offsetHeight + this._getSlideSelectorsHeight()}px`;
    }

    private _setContainerStyle(): Promise<any> {
        // this._container.style.width = `${this.offsetWidth}px`;
        Array.from(this._container.children).forEach((slide: HTMLElement) => {
            this._setSlideStyle(slide);
        });

        this._setCarouselHeightToSlideHeight();

        return Promise.resolve();
    }

    private _setCurrentSlide(slideIndex: number) {
        const requestedSlide = this._slides[slideIndex];

        if (!requestedSlide || requestedSlide === this._currentSlide) {
            return;
        }

        this._currentSlide = this._slides[slideIndex];
        this._onCurrentSlideChange();
    }

    private _setSlideStyle(slide: HTMLElement) {
        const slideStyles = {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            'min-height': `calc(100vh - ${this._getSlideSelectorsHeight()}px)`,
            'flex-shrink': '0',
        };
        Object.keys(slideStyles).forEach((prop: string) => {
            slide.style[prop] = slideStyles[prop];
        });
    }

    private _setTouchActive(bool: boolean) {
        switch (bool) {
        case true:
            this._touchActive = true;
            this._container.classList.add('--touch-active');
            break;
        case false:
            this._touchActive = false;
            this._touchMoveInProgress = false;
            this._container.classList.remove('--touch-active');
            break;
        default: // do nothing
        }
    }

    private _slideIntoView(slide: Slide) {
        const offsetX = this._getPrecedingSlideWidths(slide) * -1;

        this._slideTo(offsetX);
        this._currentOffsetX = offsetX;
    }

    private _slideTo(offsetX: number) {
        const maxNegativeOffsetX = this._getMaxNegativeOffsetX();
        const translateX = offsetX > this._maxOffsetX
            ? 0
            : offsetX < maxNegativeOffsetX
                ? maxNegativeOffsetX
                : offsetX;

        this._container.style.transform = `translateX(${translateX}px)`;
    }

    public get currentSlide(): number {
        return this._currentSlide.id;
    }

    public set currentSlide(slideNumber: number) {
        const slideIndex = slideNumber - 1;

        if (!this._slides[slideIndex]) {
            return;
        }

        this._slideIntoView(this._slides[slideIndex]);
        this.scrollIntoView({ behavior: this._scrollBehavior });
    }

    public set scrollbehavior(val: 'auto'|'smooth') {
        this._scrollBehavior = val;
    }

    public get scrollbehavior(): 'auto'|'smooth' {
        return this._scrollBehavior;
    }

    public updateCarouselHeight() {
        this._setCarouselHeightToSlideHeight();
    }

    protected connectedCallback() {
        // Required "slides" slot
        const requiredSlottedContent = this.querySelector('[slot=slides]');
        if (!requiredSlottedContent || !requiredSlottedContent.children.length) {
            throw Error(`${tagName} failed to render. No slotted content for "slides" was found.`);
        }

        this._slides = Array.from(this.querySelector('[slot=slides]').children)
            .map((item: HTMLElement, i: number) => {
                return {
                    id: i + 1,
                    index: i,
                    el: item,
                };
            });

        // Optional "slide-selectors" slot
        if (this.querySelector('[slot=slide-selectors]')) {
            Array.from(this.querySelector('[slot=slide-selectors]').children)
                .map((item: HTMLElement, i: number) => {
                    item.addEventListener('pointerup', (e: PointerEvent) => {
                        e.preventDefault();

                        const lastPointerdownEvent = this._pointerEvents.pointerdown.slice(-1)[0];
                        const pointerupEvent = e;

                        if (!isTap(lastPointerdownEvent, pointerupEvent)) {
                            return;
                        }

                        this._setCurrentSlide(i);
                        this._setCarouselHeightToSlideHeight();
                        this._slideIntoView(this._currentSlide);
                        this.scrollIntoView({ behavior: this._scrollBehavior });
                    });
                });

            this._slideSelectors = this._slideSelectorsSlot.assignedElements()[0] as HTMLElement;
        }

        this._setCurrentSlide(0);
        this._container = this._slidesSlot.assignedNodes()[0] as HTMLElement;

        setTimeout(() => {
            // Timeout neccessary or this._setContainerStyle() will be called
            // before the element has loaded.
            // ---------------------------------------------------------------------------------
            // According to MDN: The connectedCallback lifecycle callback is invoked each time
            // the custom element is appended into a document-connected element. This will
            // happen each time the node is moved, and may happen before the element's contents
            // have been fully parsed.
            // ----------------------------------------------------------------------------------
            this._setContainerStyle();

            this.dispatchEvent(new CustomEvent('load'));
        });
    }

    protected attributeChangedCallback(name: string, _oldVal: any, newVal: any) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }
}

customElements.define(tagName, HTMLSkyduckCarouselElement);
