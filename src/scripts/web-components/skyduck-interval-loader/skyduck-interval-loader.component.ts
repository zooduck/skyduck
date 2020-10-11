class HTMLSkyduckIntervalLoaderElement extends HTMLElement {
    private content: HTMLElement;
    private shadow: ShadowRoot;
    private styleElement: HTMLStyleElement;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
        this.styleElement = document.createElement('style');
        this.shadow.append(this.styleElement);
    }
    connectedCallback() {
        this.renderStyle();
        this.renderContent();
    }
    render() {
        this.renderStyle();
        this.renderContent();
    }
    renderStyle() {
        this.styleElement.textContent = this.getStyle();
    }
    renderContent() {
        const content = this.getContent();

        try {
            this.shadow.replaceChild(content, this.content);
        } catch (err) {
            this.shadow.append(content);
        } finally {
            this.content = content;
        }
    }
    getStyle() {
        return `
            :host {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            :host(:not([active])) {
                display: none;
            }
            @keyframes h-slide {
                0% {
                    transform: translate(-110%, 0) rotate(-18deg);
                }
                100% {
                    transform: translate(110%, -50%) rotate(-18deg);
                }
            }
            @keyframes v-slide {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(100%);
                }
            }
            .loading-bars {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                width: 100%;
                height: 100vh;
                background-color: var(--lightskyblue);
            }
            :host([loaded]) .loading-bars {
                display: none;
            }
            .loading-bars__item {
                height: 100%;
                width: 20%;
                background-color: var(--white);
                animation: v-slide 1s infinite both;
            }
            .loading-bars__item:nth-of-type(2) {
                animation-delay: 0.20s;
            }
            .loading-bars__item:nth-of-type(3) {
                animation-delay: 0.40s;
            }
            .loading-bars__item:nth-of-type(4) {
                animation-delay: 0.60s;
            }
            .loading-bars__item:nth-of-type(5) {
                animation-delay: 0.80s;
            }
            .loading-bars__horizontal-item {
                position: absolute;
                top: 0;
                left: 0;
                height: calc(100vw * 0.20);
                max-height: calc(var(--max-width) * 0.20);
                width: 100%;
                background-color: var(--white);
                animation: h-slide .5s infinite both;
            }
            .loading-bars__horizontal-item:nth-of-type(7) {
                top: 20%;
                animation-delay: .25s;
            }
            .loading-bars__horizontal-item:nth-of-type(8) {
                top: 40%;
            }
            .loading-bars__horizontal-item:nth-of-type(9) {
                top: 60%;
                animation-delay: .25s;
            }
            .loading-bars__horizontal-item:nth-of-type(10) {
                top: 80%;
            }
            .ready-layer {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.6rem;
                background-color: var(--white);
                color: var(--lightskyblue);
                box-shadow: 2px 2px 15px var(--gray);
                transform: translateY(100%);
                transition: all .5s;
            }
            :host([ready]) .ready-layer {
                transform: translateY(0);
            }
            :host([loaded]) .ready-layer {
                transform: translateX(calc((100% + 15px) * -1));
            }
        `;
    }
    getContent(): HTMLElement {
        return new DOMParser().parseFromString(`
            <div>
                <div class="loading-bars">
                    <div class="loading-bars__item"></div>
                    <div class="loading-bars__item"></div>
                    <div class="loading-bars__item"></div>
                    <div class="loading-bars__item"></div>
                    <div class="loading-bars__item"></div>

                    <div class="loading-bars__horizontal-item"></div>
                    <div class="loading-bars__horizontal-item"></div>
                    <div class="loading-bars__horizontal-item"></div>
                    <div class="loading-bars__horizontal-item"></div>
                    <div class="loading-bars__horizontal-item"></div>
                </div>
                <div class="ready-layer">
                    <zooduck-icon-skyduck-alt
                        color="var(--lightskyblue)"
                        size="100">
                    </zooduck-icon-skyduck-alt>
                </div>
            </div>
      `, 'text/html').body.firstChild as HTMLElement;
    }
}

customElements.define('skyduck-interval-loader', HTMLSkyduckIntervalLoaderElement);
