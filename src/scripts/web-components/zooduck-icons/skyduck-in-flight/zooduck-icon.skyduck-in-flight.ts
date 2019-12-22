import { HTMLZooduckIconBaseElement } from '../base/zooduck-icon.base';

const tagName = 'zooduck-icon-skyduck-in-flight';

export class HTMLZooduckIconSkyduckInFlightElement extends HTMLZooduckIconBaseElement {
    constructor() {
        super();
    }

    private _build() {
        this.styleContent = this._buildStyleContent();
        this.content = this._buildContent();

        this.render();
    }

    private _buildContent(): HTMLElement {
        const content = new DOMParser().parseFromString(`
            <div class="skyduck-in-flight-grid">
                <div class="skyduck-in-flight-airflow">
                    <span class="skyduck-in-flight-airflow__air --top"></span>
                    <span class="skyduck-in-flight-airflow__air --mid-a"></span>
                    <span class="skyduck-in-flight-airflow__air --mid-b"></span>
                    <span class="skyduck-in-flight-airflow__air --mid-c"></span>
                    <span class="skyduck-in-flight-airflow__air --mid-d"></span>
                    <span class="skyduck-in-flight-airflow__air --bottom"></span>
                </div>
                <div class="skyduck-in-flight-grid__body"></div>
                <div class="skyduck-in-flight-grid__beak"></div>
                <div class="skyduck-in-flight-grid__wing-left"></div>
                <div class="skyduck-in-flight-grid__wing-right"></div>
                <div class="skyduck-in-flight-grid__eye-left"></div>
                <div class="skyduck-in-flight-grid__eye-right"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return content;
    }

    private _buildStyleContent(): string {
        const styleContent = `
            @keyframes airshift {
                0% {
                    transform: translate(0);
                }
                100% {
                    transform: translate(100%);
                }
            }

            .skyduck-in-flight-airflow {
                position: absolute;
                left: 15%;
                top: 10%;
                width: 185%;
                height: 80%;
                display: grid;
                grid-template-rows: repeat(26, 1fr);
                background-color: var(--zooduck-icon-background-color);
                gap: 2.5%;
                overflow: hidden;
                clip-path: polygon(75% 0%, 100% 100%, 0% 100%, 0% 0%);
            }
            .skyduck-in-flight-airflow__air {
                background-color: var(--zooduck-icon-color);
                animation: airshift linear infinite both;
            }
            .skyduck-in-flight-airflow__air.--top {
                grid-row: 2 / span 3;
                animation-duration: .15s;
            }
            .skyduck-in-flight-airflow__air.--mid-a {
                grid-row: 6 / span 4;
                animation-duration: .5s;
            }
            .skyduck-in-flight-airflow__air.--mid-b {
                grid-row: 11 / span 4;
                animation-duration: .2s;
            }
            .skyduck-in-flight-airflow__air.--mid-c {
                grid-row: 15 / span 3;
                animation-duration: .2s;
                animation-delay: .1s;
            }
            .skyduck-in-flight-airflow__air.--mid-d {
                grid-row: 19 / span 3;
                animation-duration: .25s;
                animation-delay: .25s;
            }
            .skyduck-in-flight-airflow__air.--bottom {
                grid-row: 23 / span 4;
                animation-duration: .15s;
            }

            .skyduck-in-flight-grid {
                position: relative;
                width: var(--zooduck-icon-size);
                height: var(--zooduck-icon-size);
                display: grid;
                grid-template-columns: repeat(20, 5%);
                grid-template-rows: repeat(20, 5%);
                transform: rotate(-25deg);
            }
            .skyduck-in-flight-grid__wing-left {
                z-index: 0;
                grid-row: 3 / span 4;
                grid-column: 6 / span 14;
                background-color: var(--zooduck-icon-color);
                transform: skewY(-30deg) rotate(20deg);
            }
            .skyduck-in-flight-grid__wing-right {
                z-index: 0;
                grid-row: 4 / span 15;
                grid-column: 4 / span 4;
                background-color: var(--zooduck-icon-color);
                transform: skewY(-30deg);
            }
            .skyduck-in-flight-grid__body {
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle();
                background-color: var(--zooduck-icon-color);
                grid-column: 1 / span 15;
                grid-row: 1 / span 15;
            }
            .skyduck-in-flight-grid__beak {
                z-index: 2;
                background-color: var(--zooduck-icon-background-color);
                grid-column: 1 / span 11;
                grid-row: 1 / span 11;
                border-radius: 50%;
                clip-path: polygon(50% 60%, 100% 70%, 100% 100%, 30% 100%);
            }
            .skyduck-in-flight-grid__eye-left,
            .skyduck-in-flight-grid__eye-right {
                z-index: 3;
                background-color: var(--zooduck-icon-background-color);
                clip-path: polygon(80% 0%, 0% 100%, 0% 100%, 100% 100%);
            }
            .skyduck-in-flight-grid__eye-right {
                grid-column: 3 / span 2;
                grid-row: 5 / span 2;
            }
            .skyduck-in-flight-grid__eye-left {
                grid-column: 7 / span 2;
                grid-row: 4 / span 2;
            }
        `;

        return styleContent;
    }

    protected connectedCallback() {
        if (!this.isConnected) {
            return;
        }

        this._build();
    }
}

customElements.define(tagName, HTMLZooduckIconSkyduckInFlightElement);
