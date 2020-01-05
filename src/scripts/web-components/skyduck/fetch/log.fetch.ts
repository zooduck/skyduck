export class Log {
    private _location: string;

    constructor(location: string) {
        this._location = location;
    }

    private _logConnection(): void {
        fetch(`/connect?location=${this._location}`);
    }

    public connection(): void {
        return this._logConnection();
    }
}
