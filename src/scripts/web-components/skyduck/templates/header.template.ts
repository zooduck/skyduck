import { imageMap } from '../utils/image-map';

export class HeaderTemplate {
    private _userDeniedGeolocation: boolean;
    private _header: HTMLElement;
    private _version: string;

    constructor(version: string, userDeniedGeolocation: boolean) {
        this._userDeniedGeolocation = userDeniedGeolocation;
        this._version = version;
        this._buildHeader();
    }

    private _buildHeader(): void {
        this._header = new DOMParser().parseFromString(`
            <div class="header">
                <div class="header-title-container">
                    <img class="header__skyduck-logo" src="${imageMap['skyduck-logo']}" alt="skyduck-logo" />
                    <small>${this._version}</small>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        if (this._userDeniedGeolocation) {
            return;
        }

        this._header.appendChild(this._buildLocationIcon());
    }

    private _buildLocationIcon(): HTMLElement {
        const locationIcon = new DOMParser().parseFromString(`
            <zooduck-icon-location
                id="getForecastForCurrentLocation"
                class="header__location-icon"
                size="38"
                color="var(--lightskyblue)"></zooduck-icon-location>
        `, 'text/html').body.firstChild;

        return locationIcon as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._header;
    }
}
