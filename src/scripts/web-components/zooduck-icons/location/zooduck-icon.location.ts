import { HTMLZooduckIconBaseElement } from '../base/zooduck-icon.base';

const tagName = 'zooduck-icon-location';

export class HTMLZooduckIconLocationElement extends HTMLZooduckIconBaseElement {
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
            <div class="location-icon">
                <div class="location-icon__circle">
                    <div class="location-icon__inner-circle">
                        <div class="location-icon__point"></div>
                    </div>
                </div>
                <div class="location-icon__x-bar"></div>
                <div class="location-icon__y-bar"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return content;
    }

    private _buildStyleContent(): string {
        const styleContent = `
            .location-icon {
                position: relative;
                display: flex;
                width: var(--zooduck-icon-size);
                height: var(--zooduck-icon-size);
                align-items: center;
                justify-content: center;
            }
            .location-icon__circle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle();
                width: 80%;
                height: 80%;
                z-index: 1;
                background-color: var(--zooduck-icon-color);
            }
            .location-icon__inner-circle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle();
                width: 70%;
                height: 70%;
                background-color: var(--zooduck-icon-background-color);
            }
            .location-icon__point {
                width: 60%;
                height: 60%;
                clip-path: circle();
                background-color: var(--zooduck-icon-color);
            }
            .location-icon__x-bar,
            .location-icon__y-bar {
                position: absolute;
                left: auto;
                top: auto;
                width: 10%;
                height: 100%;
                background-color: var(--zooduck-icon-color);
            }
            .location-icon__y-bar {
                width: 100%;
                height: 10%;
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

customElements.define(tagName, HTMLZooduckIconLocationElement);
