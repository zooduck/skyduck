import { NotFoundTemplate } from './not-found.template';

export class ControlsTemplate {
    private _controls: HTMLElement;
    private _hasClubList: boolean;
    private _showMap: boolean;

    constructor(showMap: boolean, hasClubList: boolean) {
        this._hasClubList = hasClubList;
        this._showMap = showMap;
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
        const mapDisplayToggleState = this._showMap
            ? 'on'
            : 'off';
        this._controls = new DOMParser().parseFromString(`
            <div class="controls">
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

        this._controls.insertBefore(this._buildClubListControl(), this._controls.firstElementChild);
    }

    public get html(): HTMLElement {
        return this._controls;
    }
}
