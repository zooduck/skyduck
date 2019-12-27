import { SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { graphqlConfig } from '../../../config/graphql.config';
import { skydiveClubQuery } from '../graphql-queries/skydive-club-query';

export const querySkydiveClub = async (name: string): Promise<SkydiveClub> => {
    try {
        const response = await fetch(graphqlConfig.uri, {
            ...graphqlConfig.options,
            body: JSON.stringify({
                query: skydiveClubQuery,
                variables: {
                    name,
                },
            }),
        });

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();
        const { club } = json.data;

        return club;
    } catch (err) {
        throw new Error(err);
    }
};
