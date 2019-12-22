import { HTMLZooduckIconBaseElement } from '../base/zooduck-icon.base';

const tagName = 'zooduck-icon-circle';

export class HTMLZooduckIconCircleElement extends HTMLZooduckIconBaseElement {
    constructor() {
        super();

        this.backgroundcolor = 'transparent';
    }

    private _build() {
        this.styleContent = this._buildStyleContent();
        this.content = this._buildContent();

        this.render();
    }

    private _buildContent(): HTMLElement {
        const content = new DOMParser().parseFromString(`
            <div class="icon-circle"></div>
        `, 'text/html').body.firstChild as HTMLElement;

        return content;
    }

    private _buildStyleContent(): string {
        const styleContent = `
            .icon-circle {
                width: var(--zooduck-icon-size);
                height: var(--zooduck-icon-size);
                color: var(--zooduck-icon-color);
                background-color: var(--zooduck-icon-background-color);
                border-radius: 50%;
                border: solid calc(var(--zooduck-icon-size) * .2);
            }
        `;

        return styleContent;
    }

    protected connectedCallback() {
        if (!this.isConnected) {
            return;
        }

        this._build();
    }
}

customElements.define(tagName, HTMLZooduckIconCircleElement);
