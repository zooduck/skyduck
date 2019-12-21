import { BaseIcon } from '../base-icon';

export class CircleIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string, backgroundColor?: string) {
        super(sizeInPixels, color, backgroundColor);
    }

    private get _style(): string {
        return `
            :host(.icon-circle) {
                width: ${this.size}px;
                height: ${this.size}px;
                border-radius: 50%;
                border: solid ${Math.round(this.size * .13)}px;
                border-color: ${this.color};
            }
        `;
    }

    public get html(): HTMLElement {
        const el = new DOMParser().parseFromString(`
            <div class="icon-circle"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        el.attachShadow({ mode: 'open' });

        const stylesheet = new DOMParser().parseFromString(`
            <style>${this._style}</style>
        `, 'text/html').head.firstChild;

        el.shadowRoot.appendChild(stylesheet);

        return el;
    }
}
