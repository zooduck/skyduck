// eslint-disable-next-line no-unused-vars
import { DailyData } from '../interfaces/index';
import { ForecastHeaderTemplate } from '../templates/forecast-header.template';
import { StateAPotamus } from '../state/stateapotamus';

export const updateForecastHeader = function updateForecastHeader() {
    const { hasLoaded } = StateAPotamus.getState();

    if (!hasLoaded) {
        return;
    }

    const oldForecastHeader = this.shadowRoot.querySelector('#forecastHeader');
    const newForecastHeader = new ForecastHeaderTemplate().html;

    oldForecastHeader.replaceWith(newForecastHeader);
};
