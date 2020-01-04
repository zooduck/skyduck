import { graphqlConfig } from '../../../config/graphql.config';
import { skydiveClubsQuery } from '../graphql-queries/skydive-clubs-query';
import { DistanceBetweenPoints } from '../utils/distance-between-points';
import { SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const skydiveClubsLookup = async (position: Position): Promise<SkydiveClub[]> => {
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
            const distanceInMiles = position
                ? new DistanceBetweenPoints({
                    from: {
                        latDeg: position.coords.latitude,
                        lonDeg: position.coords.longitude,
                    },
                    to: {
                        latDeg: club.latitude,
                        lonDeg: club.longitude,
                    }
                }).miles
                : 0;

            return {
                ...club,
                distance: distanceInMiles,
            };
        });

        return clubs;
    } catch (err) {
        throw Error(err);
    }
};
