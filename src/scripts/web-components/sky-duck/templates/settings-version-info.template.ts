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
                id="versionInfo"
                class="settings__version-info">
                <a href="https://github.com/zooduck/skyduck/" target="_blank">skyduck ${this._version}</a>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._versionInfo;
    }
}
