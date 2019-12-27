export class ForecastDisplayModeToggleTemplate {
    private _forecastDisplayModeToggle: HTMLElement;

    constructor() {
        this._buildForecastDisplayModeToggle();
    }

    private _buildForecastDisplayModeToggle(): void {
        this._forecastDisplayModeToggle = new DOMParser().parseFromString(`
            <div class="controls">
                <h4 id="clubListCtrl" class="controls__view-club-list">Clubs</h4>
                <zooduck-icon-toggle
                    id="forecastDisplayModeToggle"
                    class="controls__forecast-display-mode-toggle"
                    size="70"
                    toggleoncolor="var(--lightskyblue)"
                    toggleontext="24h"
                    toggleofftext="3h"
                    fontfamily="Roboto, sans-serif"></zooduck-icon-toggle>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    public get html(): HTMLElement {
        return this._forecastDisplayModeToggle;
    }
}
