import { FormattedWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const dbWeatherLookup = async (latitude: number, longitude: number): Promise<FormattedWeather> => {
    try {
        const response = await fetch(`/weather?latitude=${latitude}&longitude=${longitude}`);

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();

        return json as FormattedWeather;
    } catch (err) {
        throw Error(err);
    }
};
