import { SkyduckIntervalLoaderTemplate } from './skyduck-interval-loader.template';
import { skyduckIntervalLoaderStyle } from './skyduck-interval-loader.style';

class HTMLSkyduckIntervalLoader extends HTMLElement {
    private _style: HTMLStyleElement;
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this._style = document.createElement('style');
        this.shadowRoot.appendChild(this._style);
    }

    connectedCallback() {
        this._style.innerHTML = skyduckIntervalLoaderStyle;
        this.shadowRoot.appendChild(new SkyduckIntervalLoaderTemplate().html);
    }
}

customElements.define('skyduck-interval-loader', HTMLSkyduckIntervalLoader);
