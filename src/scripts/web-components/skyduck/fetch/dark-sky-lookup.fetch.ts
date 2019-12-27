import { graphqlConfig } from '../../../config/graphql.config';
import { darkSkyQuery } from '../graphql-queries/dark-sky-query';

export const darkSkyLookup = async (lat: number, lon: number) => {
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
        throw new Error(err);
    }

};
