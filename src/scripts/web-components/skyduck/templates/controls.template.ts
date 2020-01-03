export class ControlsTemplate {
    private _controls: HTMLElement;
    private _showMap: boolean;

    constructor(showMap: boolean) {
        this._showMap = showMap;
        this._buildControls();
    }

    private _buildControls(): void {
        const mapDisplayToggleState = this._showMap
            ? 'on'
            : 'off';
        this._controls = new DOMParser().parseFromString(`
            <div class="controls">
                <h4 id="clubListCtrl" class="controls__view-club-list">Clubs</h4>
                <div class="controls__toggles">
                    <zooduck-icon-toggle
                        id="mapDisplayToggle"
                        class="controls__map-display-toggle"
                        size="70"
                        width="110"
                        togglestate="${mapDisplayToggleState}"
                        toggleoncolor="var(--lightskyblue)"
                        toggleontext="Map"
                        toggleofftext="Map"
                        fontfamily="Roboto, sans-serif">
                    </zooduck-icon-toggle>
                    <zooduck-icon-toggle
                        id="forecastDisplayModeToggle"
                        class="controls__forecast-display-mode-toggle"
                        size="70"
                        width="110"
                        toggleoncolor="var(--lightskyblue)"
                        toggleontext="24h"
                        toggleofftext="3h"
                        fontfamily="Roboto, sans-serif">
                    </zooduck-icon-toggle>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._controls;
    }
}
