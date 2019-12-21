class SkyduckRadio extends HTMLElement {
    private _hasLoaded = false;
    private _name = '';
    private _rawInput: HTMLInputElement;
    private _size = '24';
    private _value = '';
    private _checked = false;

    constructor() {
        super();

        this._buildRawInput();
    }

    static get observedAttributes() {
        return [
            'checked',
            'name',
            'size',
            'value',
        ];
    }

    public set checked(val: boolean) {
        this._checked = val || typeof(val) === 'string'
            ? true
            : false;

        if (!this._hasLoaded) {
            return;
        }

        this._update();
    }

    public get checked(): boolean {
        return this._checked;
    }

    public set name(val: string) {
        this._name = val;

        if (!this._hasLoaded) {
            return;
        }

        this._update();
    }

    public get name(): string {
        return this._name;
    }

    public set size(val: string) {
        this._size = val;

        if (!this._hasLoaded) {
            return;
        }

        this._update();
    }

    public get size(): string {
        return this._size;
    }

    public set value(val: string) {
        this._value = val;

        if (!this._hasLoaded) {
            return;
        }

        this._update();
    }

    public get value(): string {
        return this._value;
    }

    private _buildRawInput(): void {
        this._rawInput = new DOMParser().parseFromString(`
            <input type="radio" name="${this._name}" value="${this._value}" />
        `, 'text/html').body.firstChild as HTMLInputElement;

        this._rawInput.checked = this._checked;

        if (this._checked) {
            this._rawInput.setAttribute('checked', '');
        }

        this._rawInput.addEventListener('change', () => {
            this._checked = this._rawInput.checked;
        });
    }

    private _render(): void {
        this.innerHTML = '';

        const style = document.createElement('style');
        this.appendChild(style);

        this._updateStyle();

        const html = new DOMParser().parseFromString(`
            <label class="zooduck-radio">
                    <i class="zooduck-radio__icon --off"></i>
                    <i class="zooduck-radio__icon --on"></i>
                    <span id="zooduckRadioValue" class="zooduck-radio__value">${this._value}</span>
            </label>
        `, 'text/html').body.firstChild;

        html.insertBefore(this._rawInput, html.childNodes[0]);

        this.appendChild(html);
    }

    private _update() {
        this._updateValue();
        this._updateRawInput();
        this._updateStyle();
    }

    private _updateRawInput(): void {
        this._rawInput.name = this._name;
        this._rawInput.value = this._value;
        this._rawInput.checked = this._checked;
    }

    private _updateStyle(): void {
        const style = this.querySelector('style');
        const size = parseInt(this._size, 10);

        style.textContent = `
            .zooduck-radio {
                display: grid;
                grid-template-columns: auto 1fr;
                align-items: center;
                gap: 5px;
                cursor: pointer;
            }
            .zooduck-radio__value {
                color: #222;
            }
            .zooduck-radio__icon {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${size}px;
                height: ${size}px;
                border: solid var(--color, #bbb);
                border-width: calc(${size}px / 8);
                border-radius: 50%;
            }
            .zooduck-radio__icon.--on {
                display: none;
            }
            .zooduck-radio__icon.--on:before {
                display: block;
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 50%;
                height: 50%;
                clip-path: circle();
                background-color: var(--color, #bbb);
            }
            input[type=radio] {
                display: none;
            }
            input:checked ~.zooduck-radio__icon.--on,
            input:not(:checked) ~.zooduck-radio__icon.--off {
                display: flex;
            }
            input:not(:checked) ~.zooduck-radio__icon.--on,
            input:checked ~.zooduck-radio__icon.--off {
                display: none;
            }
        `;
    }

    private _updateValue() {
        this.querySelector('#zooduckRadioValue').innerHTML = this._value;
    }

    protected attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
        if (this[name] !== newVal) {
            this[name] = newVal;
        }
    }

    protected connectedCallback() {
        this._render();
        this._update();

        this.dispatchEvent(new CustomEvent('load', {
            detail: {
                name: this._name,
                value: this._value,
                checked: this._checked,
            }
        }));

        this._hasLoaded = true;
    }
}

customElements.define('skyduck-radio', SkyduckRadio);
