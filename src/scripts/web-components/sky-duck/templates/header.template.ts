export class HeaderTemplate {
    private _eventHandler: CallableFunction;
    private _header: HTMLElement;
    private _subTitle: string;
    private _title: string;

    constructor(
        title: string,
        subTitle: string,
        eventHandler?: CallableFunction) {
        this._eventHandler = eventHandler;
        this._subTitle = subTitle || '';
        this._title = title || '';

        this._buildHeader();
    }

    private _buildHeader(): void {
        this._header = new DOMParser().parseFromString(`
            <div
                class="header --render-once"
                id="header">
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
                class="header-title"
                id="headerTitle">
                    <div class="header-title__item">${this._title}</div>
                    <div class="header-title__item --sub-title">${this._subTitle}</div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._eventHandler) {
            return;
        }

        this._header.querySelector('#settingsToggle').addEventListener('click', (e: Event) => {
            this._eventHandler(e);
        });
    }

    public get html(): HTMLElement {
        return this._header;
    }
}
