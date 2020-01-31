export class NotFoundTemplate {
    private _notFound: HTMLElement;
    private _id: string;
    private _text: string;

    constructor(text: string, id?: string) {
        this._text = text;
        this._id = id;

        this._buildNotFound();
    }

    private _buildNotFound(): void {
        this._notFound = new DOMParser().parseFromString(`
            <span style="display: none;">${this._text}</span>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._id) {
            return;
        }

        this._notFound.id = this._id;
    }

    public get html(): HTMLElement {
        return this._notFound;
    }
}
