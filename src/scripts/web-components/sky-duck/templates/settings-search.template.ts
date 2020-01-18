export class SearchTemplate {
    private _search: HTMLElement;

    constructor() {
        this._buildSearch();
    }

    private _buildSearch(): void {
        this._search = new DOMParser().parseFromString(`
            <div class="search">
                <zooduck-input
                    id="searchInput"
                    label="Location Search"
                    placeholder="e.g. Perris, CA 92570, USA">
                </zooduck-input>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._search;
    }
}
