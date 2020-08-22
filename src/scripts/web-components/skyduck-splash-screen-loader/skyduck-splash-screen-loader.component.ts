import { skyduckSplashScreenLoaderStyle } from './skyduck-splash-screen-loader.style';
import { SkyduckSplashScreenLoaderTemplate } from './skyduck-splash-screen-loader.template';

class HTMLSkyduckSplashScreenLoader extends HTMLElement {
    private _style: HTMLStyleElement;
    private _version: string;

    constructor() {
        super();

        this._style = document.createElement('style');
        this._version = '';

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(this._style);
        this.shadowRoot.appendChild(document.createElement('div'));
    }

    public static get observedAttributes() {
        return ['version'];
    }

    protected attributeChangedCallback(attr: string, oldVal: string|null, newVal: string|null) {
        if (oldVal === newVal) {
            return;
        }

        this[attr] = newVal;

        this._render();
    }

    protected async connectedCallback() {
        this._render();
    }

    public get version(): string {
        return this._version;
    }

    public set version(val: string) {
        this._version = val;
        this.setAttribute('version', val);
    }

    private get _template(): HTMLElement {
        return new SkyduckSplashScreenLoaderTemplate({ version: this._version }).html;
    }

    private _render() {
        this._updateStyle();
        this.shadowRoot.replaceChild(this._template, this.shadowRoot.querySelector('style').nextElementSibling);
    }

    private _updateStyle() {
        this._style.innerHTML = skyduckSplashScreenLoaderStyle();
    }
}

customElements.define('skyduck-splash-screen-loader', HTMLSkyduckSplashScreenLoader);
