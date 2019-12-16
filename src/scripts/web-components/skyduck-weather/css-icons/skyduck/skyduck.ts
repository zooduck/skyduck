import { BaseIcon } from '../base-icon';

export class SkyduckIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string, invert?: boolean) {
        super(sizeInPixels, color, invert);
    }

    public get html(): HTMLElement {
        return new DOMParser().parseFromString(`
            <div class="skyduck-icon">
                <div class="skyduck-icon__body"></div>
                <div class="skyduck-icon__beak"></div>
                <div class="skyduck-icon__wing-left"></div>
                <div class="skyduck-icon__wing-right"></div>
                <div class="skyduck-icon__eye-left"></div>
                <div class="skyduck-icon__eye-right"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get style(): string {
        return `
            .skyduck-icon {
                position: relative;
                width: ${this.size}px;
                height: ${this.size}px;
                display: grid;
                grid-template-columns: repeat(20, 5%);
                grid-template-rows: repeat(20, 5%);
            }
            .skyduck-icon__wing-left {
                z-index: 0;
                grid-row: 3 / span 4;
                grid-column: 6 / span 14;
                background-color: ${this.color};
                transform: skewY(-30deg) rotate(20deg);
            }
            .skyduck-icon__wing-right {
                z-index: 0;
                grid-row: 4 / span 15;
                grid-column: 4 / span 4;
                background-color: ${this.color};
                transform: skewY(-30deg);
            }
            .skyduck-icon__body {
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background-color: ${this.color};
                grid-column: 1 / span 15;
                grid-row: 1 / span 15;
            }
            .skyduck-icon__beak {
                z-index: 2;
                border-radius: 50%;
                background-color: ${this.backgroundColor};
                grid-column: 1 / span 11;
                grid-row: 1 / span 11;
                clip-path: polygon(50% 60%, 100% 70%, 100% 100%, 30% 100%);
            }
            .skyduck-icon__eye-left,
            .skyduck-icon__eye-right {
                z-index: 3;
                background-color: ${this.backgroundColor};
                border-radius: 50%;
            }
            .skyduck-icon__eye-right {
                grid-column: 3 / span 2;
                grid-row: 5 / span 2;
            }
            .skyduck-icon__eye-left {
                grid-column: 7 / span 2;
                grid-row: 4 / span 2;
            }
        `;
    }
}
