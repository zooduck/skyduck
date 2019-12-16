import { BaseIcon } from '../base-icon';

export class LocationIcon extends BaseIcon {
    constructor(sizeInPixels?: number, color?: string) {
        super(sizeInPixels, color);
    }

    public get html(): HTMLElement {
        return new DOMParser().parseFromString(`
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
    }

    public get style(): string {
        return `
            .location-icon {
                position: relative;
                display: flex;
                width: ${this.size}px;
                height: ${this.size}px;
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
                background-color: ${this.color};
            }
            .location-icon__inner-circle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 70%;
                height: 70%;
                background-color: #fff;
            }
            .location-icon__point {
                width: 60%;
                height: 60%;
                border-radius: 50%;
                background-color: ${this.color};
            }
            .location-icon__x-bar,
            .location-icon__y-bar {
                position: absolute;
                left: auto;
                top: auto;
                width: 10%;
                height: 100%;
                background-color: ${this.color};
            }
            .location-icon__y-bar {
                width: 100%;
                height: 10%;
            }
        `;
    }
}
