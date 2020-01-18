export class GlassTemplate {
    private _glass: HTMLElement;

    constructor() {
        this._buildGlass();
    }

    private _buildGlass(): void {
        this._glass = new DOMParser().parseFromString(`
            <div
                class="glass --render-once"
                id="settingsGlass">
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._glass;
    }
}
