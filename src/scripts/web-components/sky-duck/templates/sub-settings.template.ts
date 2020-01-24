export class SubSettingsTemplate {
    private _subSettings: HTMLElement;

    constructor() {
        this._buildSubSettings();
    }

    private _buildSubSettings(): void {
        this._subSettings = new DOMParser().parseFromString(`
            <div
                class="sub-settings --render-once"
                id="subSettings">
                <div class="settings-grid"></div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._subSettings;
    }
}
