// eslint-disable-next-line no-unused-vars
import { ClubListsSortedByCountry, SkydiveClub } from '../interfaces/index';

export const getClubCountries = (clubsSortedByCountry: ClubListsSortedByCountry, nearestClub: SkydiveClub) => {
    const clubListCountries = Object.keys(clubsSortedByCountry).filter((country: string) => {
        if (nearestClub && nearestClub.country) {
            return country !== nearestClub.country;
        }

        return true;
    });

    if (nearestClub && nearestClub.country) {
        clubListCountries.unshift(nearestClub.country);
    }

    return clubListCountries;
};
