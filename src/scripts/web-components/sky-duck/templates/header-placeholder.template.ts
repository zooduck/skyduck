export class HeaderPlaceholderTemplate {
    private _headerPlaceholder: HTMLElement;

    constructor() {
        this._buildHeaderPlaceholder();
    }

    private _buildHeaderPlaceholder(): void {
        this._headerPlaceholder = new DOMParser().parseFromString(`
            <div class="header-placeholder --render-once"></div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._headerPlaceholder;
    }
}
