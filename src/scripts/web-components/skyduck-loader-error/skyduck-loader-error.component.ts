import { SkyduckLoaderErrorTemplate } from './skyduck-loader-error.template';
import { skyduckLoaderErrorStyle } from './skyduck-loader-error.style';

class HTMLSkyduckLoaderErrorElement extends HTMLElement {
    private _content: HTMLElement;
    private _style: HTMLStyleElement;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this._style = document.createElement('style');
        this.shadowRoot.appendChild(this._style);
    }

    static get observedAttributes(): string[] {
        return ['message'];
    }

    attributeChangedCallback(attr: string, _oldVal: string, newVal: string) {
        if (attr !== 'message' || !this._content) {
            return;
        }

        const updatedContent = new SkyduckLoaderErrorTemplate(newVal).html;
        this.shadowRoot.replaceChild(updatedContent, this._content);

        this._content = updatedContent;
    }

    connectedCallback() {
        this._style.innerHTML = skyduckLoaderErrorStyle;
        this._content = new SkyduckLoaderErrorTemplate(this.message).html;

        this.shadowRoot.appendChild(this._content);
    }

    public get message() {
        return this.getAttribute('message');
    }

    public set message(val: string) {
        this.setAttribute('message', val);
    }
}

customElements.define('skyduck-loader-error', HTMLSkyduckLoaderErrorElement);
