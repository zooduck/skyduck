import { graphqlConfig } from '../config/graphql.config';
import { darkSkyQuery } from '../graphql-queries/dark-sky-query';
import { DarkSkyWeather } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const darkSkyLookup = async (lat: number, lon: number): Promise<DarkSkyWeather> => {
    try {
        const response = await fetch(graphqlConfig.uri, {
            ...graphqlConfig.options,
            body: JSON.stringify({
                query: darkSkyQuery,
                variables: {
                    lat,
                    lon,
                },
            }),
        });

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();
        const { weather } = json.data;

        return weather;
    } catch (err) {
        throw Error(err);
    }

};
