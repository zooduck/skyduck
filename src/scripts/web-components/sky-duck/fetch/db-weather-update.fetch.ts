import { FormattedWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const dbWeatherUpdate = async (darkSkyData: FormattedWeather): Promise<FormattedWeather> => {
    const weatherAPI = '/weather/update';
    const method = 'PUT';

    const response = await fetch(weatherAPI, {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(darkSkyData),
    });

    if (!response.ok) {
        throw Error(`${response.status} (${response.statusText})`);
    }

    const weather: FormattedWeather = await response.json();

    return weather;
};
