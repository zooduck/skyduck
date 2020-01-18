export class HeaderTemplate {
    private _header: HTMLElement;
    private _title: string;
    private _version: string;

    constructor(version: string, title: string) {
        this._title= title || '';
        this._version = version || '';

        this._buildHeader();
    }

    private _buildHeader(): void {
        this._header = new DOMParser().parseFromString(`
        <div class="header --render-once">
            <zooduck-icon-menu
                class="header__settings-control"
                id="settingsToggle"
                color="var(--white)"
                size="30">
            </zooduck-icon-menu>
            <zooduck-icon-skyduck-alt
                class="header__logo"
                size="40"
                color="var(--lightskyblue)"
                backgroundcolor="var(--white)">
            </zooduck-icon-skyduck-alt>
            <div
            class="header__title"
            id="headerTitle">${this._title}</div>
            <div class="header__version">${this._version}</div>
        </div>
    `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._header;
    }
}
