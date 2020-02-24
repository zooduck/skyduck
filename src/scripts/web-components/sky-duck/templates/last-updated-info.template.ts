export class LastUpdatedInfoTemplate {
    private _lastUpdatedDate: string;
    private _lastUpdatedInfo: HTMLElement;

    constructor(lastUpdatedDate: string) {
        this._lastUpdatedDate = lastUpdatedDate;

        this._buildLastUpdatedInfo();
    }

    private _buildLastUpdatedInfo(): void {
        this._lastUpdatedInfo = new DOMParser().parseFromString(`
            <div class="last-updated-info" id="lastUpdatedInfo">Last Updated: ${this._lastUpdatedDate}</div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._lastUpdatedInfo;
    }
}
