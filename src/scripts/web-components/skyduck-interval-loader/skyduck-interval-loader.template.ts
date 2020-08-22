export class SkyduckIntervalLoaderTemplate {
    private _html: HTMLElement;

    constructor() {
        this._build();
    }

    private _build(): void {
        this._html = new DOMParser().parseFromString(`
            <div class="skyduck-interval-loader">
                <div class="skyduck-interval-loader__layer-1">
                    <strong>READY!</strong>
                </div>
                <div class="skyduck-interval-loader__layer-2">

                    <zooduck-icon-skyduck-alt
                        size="100"
                        color="white"
                        backgroundcolor="lightskyblue">
                    </zooduck-icon-skyduck-alt>

                    <!--

                    <zooduck-icon-skyduck-in-flight
                        class="loader__skyduck-alt-loader"
                        size="150"
                        color="var(--white)"
                        backgroundcolor="var(--lightskyblue)">
                    </zooduck-icon-skyduck-in-flight>

                    -->

                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html() {
        return this._html;
    }

}
