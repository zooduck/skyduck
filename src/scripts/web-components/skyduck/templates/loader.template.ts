interface InfoElements {
    [key: string]: HTMLElement;
}

export class LoaderTemplate {
    private _loader: HTMLElement;
    private _infoElements: InfoElements;
    private _spinner: HTMLElement;

    constructor() {
        this._buildSpinner();
        this._buildLoader();
        this._setIds();
    }

    private _buildLoader(): void {
        this._loader = new DOMParser().parseFromString(`
            <div class="loader" id="skyduckLoader">
                <div class="loader-info">
                    <div id="loaderInfoLat"></div>
                    <div id="loaderInfoLon"></div>
                    <div id="loaderInfoPlace" class="loader-info__place"></div>
                    <div id="loaderInfoIANA"></div>
                    <div id="loaderInfoLocalTime"></div>
                </div>
                <div id="loaderError" class="loader__error"></div>
                <div class="loader-bar">
                    <div id="loaderBarInner" class="loader-bar__inner"></div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._loader.insertBefore(this._spinner, this._loader.lastElementChild);
    }

    private _buildSpinner(): void {
        this._spinner = new DOMParser().parseFromString(`
            <zooduck-icon-skyduck-in-flight
                class="loader__icon"
                size="100"
                color="var(--lightskyblue)"></zooduck-icon-skyduck-in-flight>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    private _setIds(): void {
        this._infoElements = {
            loaderInfoLat: this._loader.querySelector('#loaderInfoLat'),
            loaderInfoLon: this._loader.querySelector('#loaderInfoLon'),
            loaderInfoPlace: this._loader.querySelector('#loaderInfoPlace'),
            loaderInfoIANA: this._loader.querySelector('#loaderInfoIANA'),
            loaderInfoLocalTime: this._loader.querySelector('#loaderInfoLocalTime'),
        };
    }

    public get html(): HTMLElement {
        return this._loader;
    }

    public get infoElements(): InfoElements {
        return this._infoElements;
    }
}
