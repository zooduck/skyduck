export class SettingsVersionInfoTemplate {
    private _version: string;
    private _versionInfo: HTMLElement;

    constructor(version: string) {
        this._version = version;

        this._buildVersionInfo();
    }

    private _buildVersionInfo(): void {
        this._versionInfo = new DOMParser().parseFromString(`
            <div
                id="versioInfo"
                class="settings__version-info">
                <span>Version ${this._version}</span>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._versionInfo;
    }
}
