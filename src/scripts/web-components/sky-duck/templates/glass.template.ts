export class GlassTemplate {
    private _className: string;
    private _eventHandler: CallableFunction;
    private _glass: HTMLElement;
    private _id: string;

    constructor(
        id: string,
        className: string,
        eventHandler?: CallableFunction) {
        this._eventHandler = eventHandler;
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

        if (!this._eventHandler) {
            return;
        }

        this._glass.addEventListener('click', (e: Event) => {
            this._eventHandler(e);
        });
    }

    public get html(): HTMLElement {
        return this._glass;
    }
}
