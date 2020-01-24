export class GlassTemplate {
    private _className: string;
    private _glass: HTMLElement;
    private _id: string;

    constructor(id: string, className: string) {
        this._id = id;
        this._className = className;

        this._buildGlass();
    }

    private _buildGlass(): void {
        this._glass = new DOMParser().parseFromString(`
            <div
                class="glass --render-once ${this._className}"
                id="${this._id}">
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._glass;
    }
}
