// eslint-disable-next-line no-unused-vars
import { SkydiveClub, GeocodeData, ClubListsSortedByCountry, ClubCountries } from '../interfaces/index';
import { sortClubsByName } from './sort-clubs-by-name';
import { updateClubDistances } from './update-club-distances';
import { sortClubsByDistance } from './sort-clubs-by-distance';
import { StateAPotamus } from '../state/stateapotamus';
import { getClubCountries } from './get-club-countries';
import { sortClubsByCountry } from './sort-clubs-by-country';

export const sortClubs = (clubs: SkydiveClub[], userLocation: GeocodeData): void => {
    let clubsSorted: SkydiveClub[];
    let nearestClub: SkydiveClub;

    clubsSorted = updateClubDistances(clubs, userLocation);

    sortClubsByName(clubsSorted);

    if (userLocation) {
        const { countryRegion: country } = userLocation.address;

        const clubsInOtherCountries: SkydiveClub[] = [];
        const clubsInSameCountryAsUser: SkydiveClub[] = clubsSorted.filter((club: SkydiveClub) => {
            const isClubInSameCountryAsUser = club.countryAliases.includes(country);

            if (!isClubInSameCountryAsUser) {
                clubsInOtherCountries.push(club);
            }

            return club.countryAliases.includes(country);
        });

        sortClubsByDistance(clubsInSameCountryAsUser);

        nearestClub = clubsInSameCountryAsUser[0];

        clubsSorted = clubsInSameCountryAsUser.concat(clubsInOtherCountries);

        StateAPotamus.dispatch('NEAREST_CLUB_CHANGE', {
            nearestClub,
        });
    }

    const clubsSortedByCountry: ClubListsSortedByCountry = sortClubsByCountry(clubsSorted);
    const clubCountries: ClubCountries = getClubCountries(clubsSortedByCountry, nearestClub);

    StateAPotamus.dispatch('SET_CLUBS', {
        clubs,
        clubsSortedByCountry,
        clubCountries,
        nearestClub,
    });
};
