import { StateAPotamus } from '../state/stateapotamus';

export class LoaderTemplate {
    private _loader: HTMLElement;

    constructor() {
        this._buildLoader();
    }

    private _buildLoader(): void {
        this._loader = new DOMParser().parseFromString(`
            <div class="loader --render-once">
                <skyduck-interval-loader></skyduck-interval-loader>
                <skyduck-splash-screen-loader version="${StateAPotamus.getState().version}" active></skyduck-splash-screen-loader>
                <skyduck-loader-error></skyduck-loader-error>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._loader;
    }
}
