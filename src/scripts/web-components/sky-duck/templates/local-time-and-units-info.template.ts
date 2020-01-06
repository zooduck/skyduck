import { DateTime } from 'luxon';

export class LocalTimeAndUnitsInfoTemplate {
    private _localTimeAndUnitsInfo: HTMLElement;
    private _timezone: string;

    constructor(timezone: string) {
        this._timezone = timezone;
        this._buildLocalTimeAndUnitsInfo();
    }

    private _buildLocalTimeAndUnitsInfo(): void {
        const locationTime = DateTime.local()
            .setZone(this._timezone)
            .toLocaleString(DateTime.TIME_24_SIMPLE);

        this._localTimeAndUnitsInfo = new DOMParser().parseFromString(`
            <ul class="local-time-and-units-info-grid">
                <li>Local time: ${locationTime}</li>
                <li>miles, mph, celsius</li>
            </ul>
        `, 'text/html').body.firstChild as HTMLElement;

    }

    public get html(): HTMLElement {
        return this._localTimeAndUnitsInfo;
    }
}
