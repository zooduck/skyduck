export class NotFoundTemplate {
    private _clubListNotFound: HTMLElement;
    private _text: string;

    constructor(text: string) {
        this._text = text;
        this._buildClubListNotFound();
    }

    private _buildClubListNotFound(): void {
        this._clubListNotFound = new DOMParser().parseFromString(`
            <span style="display: none;">${this._text}</span>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._clubListNotFound;
    }
}
