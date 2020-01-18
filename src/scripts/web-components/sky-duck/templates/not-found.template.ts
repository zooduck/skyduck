export class NotFoundTemplate {
    private _clubListNotFound: HTMLElement;
    private _id: string;
    private _text: string;

    constructor(text: string, id?: string) {
        this._text = text;
        this._id = id;

        this._buildClubListNotFound();
    }

    private _buildClubListNotFound(): void {
        this._clubListNotFound = new DOMParser().parseFromString(`
            <span style="display: none;">${this._text}</span>
        `, 'text/html').body.firstChild as HTMLElement;

        if (this._id) {
            this._clubListNotFound.setAttribute('id', this._id);
        }
    }

    public get html(): HTMLElement {
        return this._clubListNotFound;
    }
}
