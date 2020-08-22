export class SkyduckSplashScreenLoaderTemplate {
    private _html: HTMLElement;
    private _version: string;

    constructor({ version }) {
        this._version = version;
        this._build();
    }

    private _build(): void {
        this._html = new DOMParser().parseFromString(`
            <div class="skyduck-splash-screen-loader">
                <div class="skyduck-text-loader">
                    <div class="skyduck-text-loader__inner">
                        <div class="skyduck-text-loader__name">
                            <span class="skyduck-text-loader__name-char">S</span>
                            <span class="skyduck-text-loader__name-char">K</span>
                            <span class="skyduck-text-loader__name-char">Y</span>
                            <span class="skyduck-text-loader__name-char">D</span>
                            <span class="skyduck-text-loader__name-char">U</span>
                            <span class="skyduck-text-loader__name-char">C</span>
                            <span class="skyduck-text-loader__name-char">K</span>
                        </div>
                        <div class="skyduck-text-loader__version">
                            <small>v${this._version}</small>
                        </div>
                        <div class="skyduck-text-loader__background"></div>
                    </div>
                    <div class="skyduck-text-loader__progress">
                        <div class="skyduck-text-loader__progress-bar"></div>
                    </div>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._html;
    }
}
