import { graphqlConfig } from '../config/graphql.config';
import { skydiveClubsQuery } from '../graphql-queries/skydive-clubs-query';
import { SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const skydiveClubsLookup = async (): Promise<SkydiveClub[]> => {
    try {
        const graphqlResponse = await fetch(graphqlConfig.uri, {
            ...graphqlConfig.options,
            body: JSON.stringify({
                query: skydiveClubsQuery,
            }),
        });

        if (!graphqlResponse.ok) {
            throw Error(`(${graphqlResponse.status}) ${graphqlResponse.statusText}`);
        }

        const json = await graphqlResponse.json();
        const clubs: SkydiveClub[] = json.data.clubs.map((club: SkydiveClub) => {
            return {
                ...club,
                distance: 0,
            };
        });

        return clubs;
    } catch (err) {
        throw Error(err);
    }
};
