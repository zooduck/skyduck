import { BaseIcon } from '../base-icon';

export class LocationIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string, backgroundColor?: string) {
        super(sizeInPixels, color, backgroundColor);
    }

    private get _style(): string {
        return `
            :host(.location-icon) {
                --location-icon-color: ${this.color};
                --location-icon-background-color: ${this.backgroundColor};
                --location-icon-size: ${this.size}px;

                position: relative;
                display: flex;
                width: var(--location-icon-size);
                height: var(--location-icon-size);
                align-items: center;
                justify-content: center;
            }
            .location-icon__circle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 80%;
                height: 80%;
                z-index: 1;
                background-color: var(--location-icon-color);
            }
            .location-icon__inner-circle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 70%;
                height: 70%;
                background-color: var(--location-icon-background-color);
            }
            .location-icon__point {
                width: 60%;
                height: 60%;
                border-radius: 50%;
                background-color: var(--location-icon-color);
            }
            .location-icon__x-bar,
            .location-icon__y-bar {
                position: absolute;
                left: auto;
                top: auto;
                width: 10%;
                height: 100%;
                background-color: var(--location-icon-color);
            }
            .location-icon__y-bar {
                width: 100%;
                height: 10%;
            }
        `;
    }

    public get html(): HTMLElement {
        const el = new DOMParser().parseFromString(`
            <div class="location-icon"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        el.attachShadow({ mode: 'open' });

        const content = `
            <div class="location-icon__circle">
                <div class="location-icon__inner-circle">
                    <div class="location-icon__point"></div>
                </div>
            </div>
            <div class="location-icon__x-bar"></div>
            <div class="location-icon__y-bar"></div>
        `;

        const stylesheet = new DOMParser().parseFromString(`
            <style>${this._style}</style>
        `, 'text/html').head.firstChild;

        el.shadowRoot.innerHTML = content;
        el.shadowRoot.insertBefore(stylesheet, el.shadowRoot.childNodes[0]);

        return el;
    }
}
