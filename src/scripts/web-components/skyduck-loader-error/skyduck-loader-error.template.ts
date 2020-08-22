export class SkyduckLoaderErrorTemplate {
    private _html: HTMLElement;
    private _message: string;

    constructor(message = '') {
        this._message = message;
        this._build();
    }

    private _build(): void {
        this._html = new DOMParser().parseFromString(`
            <div class="skyduck-loader-error">${this._message}</div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._html;
    }
}
