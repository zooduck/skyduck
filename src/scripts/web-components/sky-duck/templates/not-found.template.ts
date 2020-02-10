export class NotFoundTemplate {
    private _className: string;
    private _id: string;
    private _notFound: HTMLElement;
    private _text: string;

    constructor(text: string, id?: string, className?: string) {
        this._text = text;
        this._id = id || '';
        this._className = className || '';

        this._buildNotFound();
    }

    private _buildNotFound(): void {
        this._notFound = new DOMParser().parseFromString(`
            <span class="${this._className}" style="display: none;">${this._text}</span>
        `, 'text/html').body.firstChild as HTMLElement;

        if (!this._id) {
            return;
        }

        this._notFound.setAttribute('id', this._id);
    }

    public get html(): HTMLElement {
        return this._notFound;
    }
}
