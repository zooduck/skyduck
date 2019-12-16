import { BaseIcon } from '../base-icon';

export class CircleIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string) {
        super(sizeInPixels, color);
    }

    public get html(): HTMLElement {
        return new DOMParser().parseFromString(`
            <i class="icon-circle"></i>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get style(): string {
        return `
            .icon-circle {
                width: ${this.size}px;
                height: ${this.size}px;
                border-radius: 50%;
                border: solid ${Math.round(this.size * .13)}px;
                border-color: ${this.color};
            }
        `;
    }
}
