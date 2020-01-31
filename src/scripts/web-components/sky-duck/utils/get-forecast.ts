import { StateAPotamus } from '../state/stateapotamus';
import { SkyduckWeather } from '../services/skyduck-weather';
// eslint-disable-next-line no-unused-vars
import { DailyForecast } from '../interfaces/index';

export const getForecast = async function getForecast(): Promise<void> {
    const { club, clubs, geocodeData } = StateAPotamus.getState();

    if (!club && !geocodeData) {
        return;
    }

    const weather = new SkyduckWeather();

    if (club) {
        const forecast: DailyForecast = await weather.getDailyForecastByClub(club, clubs);

        StateAPotamus.dispatch('GET_FORECAST_BY_CLUB', {
            forecast,
        });

        return;
    }

    if (geocodeData) {
        const forecast: DailyForecast = await weather.getDailyForecastByQuery(geocodeData);

        StateAPotamus.dispatch('GET_FORECAST_BY_LOCATION', {
            forecast,
        });

        return;
    }
};
