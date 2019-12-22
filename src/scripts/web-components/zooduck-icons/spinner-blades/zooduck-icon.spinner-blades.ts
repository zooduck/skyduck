import { HTMLZooduckIconBaseElement } from '../base/zooduck-icon.base';

const tagName = 'zooduck-icon-spinner-blades';

export class HTMLZooduckIconSpinnerBladesElement extends HTMLZooduckIconBaseElement {
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
            <div class="spinner-blades --spin">
                <span class="spinner-blades__part --top-left"></span>
                <span class="spinner-blades__part --top-right"></span>
                <span class="spinner-blades__part --bottom-left"></span>
                <span class="spinner-blades__part --bottom-right"></span>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        return content;
    }

    private _buildStyleContent(): string {
        const styleContent = `
            @keyframes spin {
                0% {
                    transform: rotate(0deg) scale(1);
                }
                25% {
                    transform: rotate(180deg) scale(.9);
                }
                50% {
                    transform: rotate(540deg) scale(.7);
                }
                74% {
                    transform: rotate(720deg) scale(.9);
                }
                100% {
                    transform: rotate(900deg) scale(1);
                }
            }

            .--spin {
                animation: spin 1s linear infinite;
            }

            .spinner-blades {
                position: relative;
                display: grid;
                grid-template-columns: repeat(2, auto);
                grid-template-rows: repeat(2, auto);
                width: var(--zooduck-icon-size);
                height: var(--zooduck-icon-size);
                background-color: var(--zooduck-icon-background-color);
                clip-path: circle();
            }

            .spinner-blades__part {
                border-style: solid;
                border-color: var(--zooduck-icon-color);
                border-top-width: 0;
                border-right-width: calc(var(--zooduck-icon-size) * .2);
                border-bottom-width: calc(var(--zooduck-icon-size) * .2);
                border-left-width: calc(var(--zooduck-icon-size) * .05);
                border-radius: 0 0 50%;
                transform-origin: center;
                background-color: var(--zooduck-icon-background-color);
            }

            .spinner-blades__part.--top-left {
                transform: rotate(135deg) scale(.7);
            }

            .spinner-blades__part.--top-right {
                transform: rotate(-135deg) scale(.7);
            }

            .spinner-blades__part.--bottom-left {
                transform: rotate(45deg) scale(.7);
            }

            .spinner-blades__part.--bottom-right {
                transform: rotate(-45deg) scale(.7);
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

customElements.define(tagName, HTMLZooduckIconSpinnerBladesElement);
