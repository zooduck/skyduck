import { DateTime } from 'luxon';

export class FooterTemplate {
    private _footer: HTMLElement;
    private _requestTime: number;

    constructor(requestTime: number) {
        this._requestTime = requestTime;
        this._buildFooter();
    }

    private _buildRequestTimeString(): string {
        return DateTime.fromMillis(this._requestTime)
            .toLocaleString(DateTime.DATETIME_SHORT)
            .replace(',', '');
    }

    private _buildFooter(): void {
        this._footer = new DOMParser().parseFromString(`
            <div class="footer">
                <span>${this._buildRequestTimeString()}</span>
                <a href="https://darksky.net/poweredby/" target="_blank">Powered by Dark Sky</a>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._footer;
    }
}
