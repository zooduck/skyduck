import { SkydiveClubWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const dbWeatherLookup = async (clubId: string): Promise<SkydiveClubWeather> => {
    try {
        const response = await fetch(`/weather?id=${clubId}`);

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();

        return json as SkydiveClubWeather;
    } catch (err) {
        throw Error(err);
    }
};
