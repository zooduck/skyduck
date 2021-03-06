import { FormattedWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { DateTime } from 'luxon';

export const dbWeatherLookup = async (latitude: number, longitude: number, includeNighttimeWeather: boolean): Promise<FormattedWeather> => {
    const oneHourAgo = DateTime.local().minus({ hours: 1 }).toMillis();

    try {
        const response = await fetch(`/weather/find?latitude=${latitude}&longitude=${longitude}&includeNighttimeWeather=${includeNighttimeWeather}`);

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const formattedWeather: FormattedWeather = await response.json();

        return {
            ...formattedWeather,
            isFresh: formattedWeather.requestTime > oneHourAgo,
        };
    } catch (err) {
        throw Error(err);
    }
};
