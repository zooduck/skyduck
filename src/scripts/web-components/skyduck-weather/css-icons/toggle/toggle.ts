import { BaseIcon } from '../base-icon';

export class Toggle extends BaseIcon {
    private _textLength: number;
    private _offText: string;
    private _onText: string;

    constructor(sizeInPixels = 80, color?: string, offText = '', onText = '') {
        super(sizeInPixels, color);

        const longestText = offText.length > onText.length
            ? offText
            : onText;

        this._offText = offText;
        this._onText = onText;
        this._textLength = longestText.length;
    }

    private get _style(): string {
        return `
            :host(.toggle-icon) {
                --toggle-icon-base-width: ${this.size}px;
                --toggle-icon-text-length: ${this._textLength};
                --toggle-icon-font-size: calc(var(--toggle-icon-base-width) * .25);
                --toggle-icon-on-color: ${this.color};

                box-sizing: content-box !important;
                position: relative;
                width: var(--toggle-icon-base-width);
                height: calc(var(--toggle-icon-base-width) * .525);
                user-select: none;
                padding-right: calc((var(--toggle-icon-text-length) - 2) * (var(--toggle-icon-font-size) * .6));
                /* | ====================================== | */
                /* | FORMULA FOR padding-right:             | */
                /* | (text_length - 2) * (font_size * .6)   | */
                /* | ====================================== | */
            }
            .toggle-icon label {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
            .toggle-icon__switch-base {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: lightgray;
                transition: all .25s;
                border-radius: calc(var(--toggle-icon-base-width) * .25);
                display: grid;
                align-items: center;
                grid-template-columns: repeat(2, auto);
            }
            .toggle-icon__text {
                margin: 0;
                font-family: sans-serif !important;
                font-size: var(--toggle-icon-font-size);
                color: #fff;
            }
            .toggle-icon__text.--off {
                grid-column: 1;
                margin-left: calc(var(--toggle-icon-base-width) * .125);
                justify-self: left;
            }
            .toggle-icon__text.--on {
                grid-column: 2;
                margin-right: calc(var(--toggle-icon-base-width) * .125);
                justify-self: right;
            }
            .toggle-icon__switch {
                position: absolute;
                left: 100%;
                top: calc(var(--toggle-icon-base-width) * .075);
                transform: translateX(calc(-100% - calc(var(--toggle-icon-base-width) * .075)));
                width: calc(var(--toggle-icon-base-width) * .375);
                height: calc(var(--toggle-icon-base-width) * .375);
                background-color: #fff;
                border-radius: 50%;
                transition: all .25s;
            }
            .toggle-icon input[type=checkbox] {
                display: none !important;
            }
            .toggle-icon input[type=checkbox]:checked ~ .toggle-icon__switch-base {
                background-color: var(--toggle-icon-on-color);
            }
            .toggle-icon input[type=checkbox]:checked ~ .toggle-icon__switch {
                left: calc(var(--toggle-icon-base-width) * .075);
                transform: translateX(0);
            }
            .toggle-icon input[type=checkbox]:checked ~ .toggle-icon__switch-base .toggle-icon__text.--off {
                display: none;
            }
            .toggle-icon input[type=checkbox]:not(:checked) ~ .toggle-icon__switch-base .toggle-icon__text.--on {
                display: none;
            }
        `;
    }

    public get html(): HTMLElement {
        const el = new DOMParser().parseFromString(`
            <div class="toggle-icon"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        el.attachShadow({ mode: 'open' });

        const content = `
            <div class="toggle-icon">
                <label>
                    <input type="checkbox" />
                    <div class="toggle-icon__switch-base">
                        <h3 class="toggle-icon__text --off">${this._offText}</h3>
                        <h3 class="toggle-icon__text --on">${this._onText}</h3>
                    </div>
                    <div class="toggle-icon__switch"></div>
                </label>
            </div>
        `;

        const stylesheet = new DOMParser().parseFromString(`
            <style>${this._style}</style>
        `, 'text/html').head.firstChild;

        el.shadowRoot.innerHTML = content;
        el.shadowRoot.insertBefore(stylesheet, el.shadowRoot.childNodes[0]);

        return el;
    }
}
