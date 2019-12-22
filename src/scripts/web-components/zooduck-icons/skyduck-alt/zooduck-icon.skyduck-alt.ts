import { HTMLZooduckIconBaseElement } from '../base/zooduck-icon.base';

const tagName = 'zooduck-icon-skyduck-alt';

export class HTMLZooduckIconSkyduckAltElement extends HTMLZooduckIconBaseElement {
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
            <div class="skyduck-grid">
                <div class="skyduck-grid__body"></div>
                <div class="skyduck-grid__beak"></div>
                <div class="skyduck-grid__wing-left"></div>
                <div class="skyduck-grid__wing-right"></div>
                <div class="skyduck-grid__eye-left"></div>
                <div class="skyduck-grid__eye-right"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return content;
    }

    private _buildStyleContent(): string {
        const styleContent = `
            .skyduck-grid {
                position: relative;
                width: var(--zooduck-icon-size);
                height: var(--zooduck-icon-size);
                display: grid;
                grid-template-columns: repeat(20, 5%);
                grid-template-rows: repeat(20, 5%);
            }
            .skyduck-grid__wing-left {
                z-index: 0;
                grid-row: 3 / span 4;
                grid-column: 6 / span 14;
                background-color: var(--zooduck-icon-color);
                transform: skewY(-30deg) rotate(20deg);
            }
            .skyduck-grid__wing-right {
                z-index: 0;
                grid-row: 4 / span 15;
                grid-column: 4 / span 4;
                background-color: var(--zooduck-icon-color);
                transform: skewY(-30deg);
            }
            .skyduck-grid__body {
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle();
                background-color: var(--zooduck-icon-color);
                grid-column: 1 / span 15;
                grid-row: 1 / span 15;
            }
            .skyduck-grid__beak {
                z-index: 2;
                background-color: var(--zooduck-icon-background-color);
                grid-column: 1 / span 11;
                grid-row: 1 / span 11;
                border-radius: 50%;
                clip-path: polygon(50% 60%, 100% 70%, 100% 100%, 30% 100%);
            }
            .skyduck-grid__eye-left,
            .skyduck-grid__eye-right {
                z-index: 3;
                background-color: var(--zooduck-icon-background-color);
                clip-path: circle();
            }
            .skyduck-grid__eye-right {
                grid-column: 3 / span 2;
                grid-row: 5 / span 2;
            }
            .skyduck-grid__eye-left {
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

customElements.define(tagName, HTMLZooduckIconSkyduckAltElement);
