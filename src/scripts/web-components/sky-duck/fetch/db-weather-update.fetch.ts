import { FormattedWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const dbWeatherUpdate = async (darkSkyData: FormattedWeather, method: 'POST'|'PUT'): Promise<any> => {
    const response = await fetch('/weather', {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(darkSkyData),
    });

    if (!response.ok) {
        throw Error(`${response.status} (${response.statusText})`);
    }

    const json = await response.json();

    return json;
};
