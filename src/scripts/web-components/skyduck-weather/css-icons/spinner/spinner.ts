import { BaseIcon } from '../base-icon';

export class Spinner extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string) {
        super(sizeInPixels, color);
    }

    public get html(): HTMLElement {
        return new DOMParser().parseFromString(`
            <div class="spinner">
                <span class="spinner__part --top-left"></span>
                <span class="spinner__part --top-right"></span>
                <span class="spinner__part --bottom-left"></span>
                <span class="spinner__part --bottom-right"></span>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get style(): string {
        return `
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .spinner {
                display: grid;
                grid-template-columns: repeat(2, auto);
                grid-template-rows: repeat(2, auto);
                grid-column: 1 / span 2;
                justify-self: center;
                animation: spin .5s linear infinite;
            }
            .spinner__part {
                width: ${this.size}px;
                height: ${this.size}px;
                border: solid 0 ${this.color};
                border-right-width: ${this.size * .2}px;
                border-left-width: ${this.size * .2}px;
                border-bottom-width: ${this.size * .4}px;
                border-radius: 50%;
            }
            .spinner__part.--top-left {
                transform: rotate(135deg);
            }
            .spinner__part.--top-right {
                transform: rotate(-135deg);
            }
            .spinner__part.--bottom-left {
                transform: rotate(45deg);
            }
            .spinner__part.--bottom-right {
                transform: rotate(-45deg);
            }
        `;
    }
}