export class UseCurrentLocationControlTemplate {
    private _useCurrentLocationControl: HTMLElement;

    constructor() {
        this._buildUseCurrentLocationControl();
    }

    private _buildUseCurrentLocationControl(): void {
        this._useCurrentLocationControl = new DOMParser().parseFromString(`
            <div
                class="settings__control"
                id="useCurrentLocationSetting">
                <h4>Use Current Location</h4>
                <zooduck-icon-location
                    id="useCurrentLocationControl"
                    size="35"
                    color="var(--icongray)">
                </zooduck-icon-location>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._useCurrentLocationControl;
    }
}
