import { BaseIcon } from '../base-icon';

export class SpinnerBlades extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string, backgroundColor?: string) {
        super(sizeInPixels, color, backgroundColor);
    }

    private get _style(): string {
        return `
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

            :host(.spinner-blades) {
                --spinner-blades-size: ${this.size}px;
                --spinner-blades-color: ${this.color};
                --spinner-blades-background-color: ${this.backgroundColor};

                position: relative;
                display: grid;
                grid-template-columns: repeat(2, auto);
                grid-template-rows: repeat(2, auto);
                width: var(--spinner-blades-size);
                height: var(--spinner-blades-size);
                background-color: var(--spinner-blades-background-color);
                clip-path: circle();
            }

            :host(.--spin) {
                animation: spin 1s linear infinite;
            }

            .spinner-blades__part {
                border-style: solid;
                border-color: var(--spinner-blades-color);
                border-top-width: 0;
                border-right-width: calc(var(--spinner-blades-size) * .2);
                border-bottom-width: calc(var(--spinner-blades-size) * .2);
                border-left-width: calc(var(--spinner-blades-size) * .05);
                border-radius: 0 0 50%;
                transform-origin: center;
                background-color: var(--spinner-blades-background-color);
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
    }

    public get html(): HTMLElement {
        const el = new DOMParser().parseFromString(`
            <div class="spinner-blades --spin"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        el.attachShadow({ mode: 'open' });

        const content = `
            <span class="spinner-blades__part --top-left"></span>
            <span class="spinner-blades__part --top-right"></span>
            <!-- <span class="spinner-blades__center"></span> -->
            <span class="spinner-blades__part --bottom-left"></span>
            <span class="spinner-blades__part --bottom-right"></span>
        `;

        const stylesheet = new DOMParser().parseFromString(`
            <style>${this._style}</style>
        `, 'text/html').head.firstChild;

        el.shadowRoot.innerHTML = content;
        el.shadowRoot.insertBefore(stylesheet, el.shadowRoot.childNodes[0]);

        return el;
    }
}
