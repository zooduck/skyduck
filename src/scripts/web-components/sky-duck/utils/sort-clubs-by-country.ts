import { SkydiveClub, ClubListsSortedByCountry } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const sortClubsByCountry = (clubs: SkydiveClub[]): ClubListsSortedByCountry => {
    const clubsByCountry = {};
    clubs.forEach((club: SkydiveClub) => {
        if (!clubsByCountry[club.country]) {
            clubsByCountry[club.country] = {
                country: club.country,
                countryAliases: club.countryAliases,
                furthestDZDistance: .1,
                list: [],
            };
        }
        const { list, furthestDZDistance } = clubsByCountry[club.country];

        list.push(club);

        if (club.distance > furthestDZDistance) {
            clubsByCountry[club.country].furthestDZDistance = club.distance;
        }
    });

    const sortedKeys = Object.keys(clubsByCountry).sort();
    const clubsByCountrySorted = {};
    sortedKeys.forEach((key: string) => {
        clubsByCountrySorted[key] = clubsByCountry[key];
    });

    return clubsByCountrySorted;
};
