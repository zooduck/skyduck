export class SearchTemplate {
    private _disabled: boolean;
    private _eventHandler: CallableFunction;
    private _search: HTMLElement;
    private _id: string;
    private _label: string;
    private _placeholder: string;

    constructor(
        id: string, label?:
        string, placeholder?:
        string, disabled = false,
        eventHandler?: CallableFunction) {
        this._id = id;
        this._label = label || '';
        this._placeholder = placeholder || '';
        this._disabled = disabled;
        this._eventHandler = eventHandler || function () {};

        this._buildSearch();
    }

    private _buildSearch(): void {
        this._search = new DOMParser().parseFromString(`
            <div class="search">
                <zooduck-input
                    id="${this._id}"
                    label="${this._label}"
                    placeholder="${this._placeholder}"
                    ${this._disabled ? 'disabled' : ''}>
                </zooduck-input>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._eventHandler) {
            return;
        }

        this._search.querySelector('zooduck-input').addEventListener('keyup:enter', (e: CustomEvent) => {
            this._eventHandler(e);
        });
    }

    public get html(): HTMLElement {
        return this._search;
    }
}
