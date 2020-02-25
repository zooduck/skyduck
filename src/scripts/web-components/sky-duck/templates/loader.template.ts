export class LoaderTemplate {
    private _loader: HTMLElement;
    private _spinner: HTMLElement;

    constructor() {
        this._buildSpinner();
        this._buildLoader();
    }

    private _buildLoader(): void {
        this._loader = new DOMParser().parseFromString(`
            <div
                id="skyduckLoader"
                class="loader --render-once">
                <div class="loader-info">
                    <div id="loaderInfoLat"></div>
                    <div id="loaderInfoLon"></div>
                    <div
                        id="loaderInfoPlace"
                        class="loader-info__place">
                    </div>
                    <div id="loaderInfoIANA"></div>
                    <div id="loaderInfoLocalTime"></div>
                </div>
                <div
                    id="loaderError"
                    class="loader__error">
                </div>
                <div class="loader-bar">
                    <div
                        id="loaderBarInner"
                        class="loader-bar__inner">
                    </div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._loader.insertBefore(this._spinner, this._loader.lastElementChild);
    }

    private _buildSpinner(): void {
        this._spinner = new DOMParser().parseFromString(`
            <zooduck-icon-skyduck-in-flight
                class="loader__icon"
                size="140"
                color="var(--white)"
                backgroundcolor="var(--lightskyblue)">
            </zooduck-icon-skyduck-in-flight>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._loader;
    }
}
