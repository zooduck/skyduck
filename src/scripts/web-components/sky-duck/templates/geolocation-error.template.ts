export class GeolocationErrorTemplate {
    private _geolocationError: HTMLElement;

    constructor() {
        this._buildGeolocationErrorHeader();
    }

    private _buildGeolocationErrorHeader(): void {
        this._geolocationError = new DOMParser().parseFromString(`
            <div id='geolocationError' class="geolocation-error">
                <span>
                    Geolocation permission has been blocked as the user has dismissed the permission prompt.
                    This can usually be reset in Page Info which can be accessed by clicking the lock icon next to the URL.
                </span>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._geolocationError;
    }
}
