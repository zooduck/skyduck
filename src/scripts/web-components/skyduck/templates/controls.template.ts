import { NotFoundTemplate } from './not-found.template';
import { ForecastDisplayMode, MapDisplayMode } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class ControlsTemplate {
    private _controls: HTMLElement;
    private _forecastDisplayMode: ForecastDisplayMode;
    private _hasClubList: boolean;
    private _hasForecast: boolean;
    private _mapDisplayMode: MapDisplayMode;

    constructor(mapDisplayMode: MapDisplayMode, forecastDisplayMode: ForecastDisplayMode, hasClubList: boolean, hasForecast: boolean) {
        this._forecastDisplayMode = forecastDisplayMode;
        this._hasClubList = hasClubList;
        this._hasForecast = hasForecast;
        this._mapDisplayMode = mapDisplayMode;

        this._buildControls();
    }

    private _buildClubListControl(): HTMLElement {
        if (!this._hasClubList) {
            return new NotFoundTemplate('CLUBS_NOT_FOUND').html;
        }

        return new DOMParser().parseFromString(`
            <h4 id="clubListCtrl" class="controls__view-club-list">Clubs</h4>
        `, 'text/html').body.firstChild as HTMLElement;
    }

    private _buildControls(): void {
        if (!this._hasForecast) {
            this._controls = new NotFoundTemplate('FORECAST_NOT_FOUND').html;

            return;
        }

        const mapDisplayToggleState = this._mapDisplayMode;
        const forecastDisplayModeToggleState = this._forecastDisplayMode === '24h'
            ? 'on'
            : 'off';
        this._controls = new DOMParser().parseFromString(`
            <div class="controls">
                <div class="controls__toggles">
                    <zooduck-icon-toggle
                        id="mapDisplayToggle"
                        class="controls__map-display-toggle"
                        size="70"
                        width="100"
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
                        width="100"
                        togglestate="${forecastDisplayModeToggleState}"
                        toggleoncolor="var(--lightskyblue)"
                        toggleontext="24h"
                        toggleofftext="3h"
                        fontfamily="Roboto, sans-serif">
                    </zooduck-icon-toggle>
                </div>
            </div>
        `, 'text/html').body.firstChild as HTMLElement;

        this._controls.insertBefore(this._buildClubListControl(), this._controls.firstElementChild);
    }

    public get html(): HTMLElement {
        return this._controls;
    }
}
