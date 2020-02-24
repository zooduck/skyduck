export class AttributionTemplate {
    private _attribution: HTMLElement;
    private _className: string;

    constructor(className: string) {
        this._className = className || '';

        this._buildAttribution();
    }

    private _buildAttribution(): void {
        this._attribution = new DOMParser().parseFromString(`
            <div class="${this._className}">
                <a href="https://darksky.net/poweredby/" target="_blank">
                    <img src="https://darksky.net/dev/img/attribution/poweredby-darkbackground.png" alt="Powered by Dark Sky" />
                </a>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._attribution;
    }
}
