import { DailyForecast } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const dbWeatherUpdate = async (darkSkyData: DailyForecast, method: 'POST'|'PUT'): Promise<any> => {
    const response = await fetch('/weather', {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            ...darkSkyData.club,
            ...darkSkyData.weather,
            requestTime: new Date().getTime(),
        }),
    });

    if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
    }

    const json = await response.json();

    return json;
};
