import { BaseIcon } from '../base-icon';

export class SkyduckIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string, backgroundColor?: string) {
        super(sizeInPixels, color, backgroundColor);
    }

    private get _style(): string {
        return `
            :host(.skyduck-grid) {
                --skyduck-icon-color: ${this.color};
                --skyduck-icon-background-color: ${this.backgroundColor};
                --skyduck-icon-size: ${this.size}px;

                position: relative;
                width: var(--skyduck-icon-size);
                height: var(--skyduck-icon-size);
                display: grid;
                grid-template-columns: repeat(20, 5%);
                grid-template-rows: repeat(20, 5%);
            }
            .skyduck-grid__wing-left {
                z-index: 0;
                grid-row: 3 / span 4;
                grid-column: 6 / span 14;
                background-color: #222;
                transform: skewY(-30deg) rotate(20deg);
            }
            .skyduck-grid__wing-right {
                z-index: 0;
                grid-row: 4 / span 15;
                grid-column: 4 / span 4;
                background-color: var(--skyduck-icon-color);
                transform: skewY(-30deg);
            }
            .skyduck-grid__body {
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: circle();
                background-color: var(--skyduck-icon-color);
                grid-column: 1 / span 15;
                grid-row: 1 / span 15;
            }
            .skyduck-grid__beak {
                z-index: 2;
                background-color: var(--skyduck-icon-background-color);
                grid-column: 1 / span 11;
                grid-row: 1 / span 11;
                border-radius: 50%;
                clip-path: polygon(50% 60%, 100% 70%, 100% 100%, 30% 100%);
            }
            .skyduck-grid__eye-left,
            .skyduck-grid__eye-right {
                z-index: 3;
                background-color: var(--skyduck-icon-background-color);
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
    }

    public get html(): HTMLElement {
        const el = new DOMParser().parseFromString(`
            <div class="skyduck-icon"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        el.attachShadow({ mode: 'open' });

        const content = `
            <div class="skyduck-icon__body"></div>
            <div class="skyduck-icon__beak"></div>
            <div class="skyduck-icon__wing-left"></div>
            <div class="skyduck-icon__wing-right"></div>
            <div class="skyduck-icon__eye-left"></div>
            <div class="skyduck-icon__eye-right"></div>
        `;

        const stylesheet = new DOMParser().parseFromString(`
            <style>${this._style}</style>
        `, 'text/html').head.firstChild;

        el.shadowRoot.innerHTML = content;
        el.shadowRoot.insertBefore(stylesheet, el.shadowRoot.childNodes[0]);

        return el;
    }
}
