// eslint-disable-next-line no-unused-vars
import { SkydiveClub } from '../interfaces/index';
import { escapeSpecialChars } from './escape-special-chars';

const findClub = (clubs: SkydiveClub[], clubToFind: string): SkydiveClub => {
    const clubToFindEscaped = escapeSpecialChars(clubToFind).toLowerCase();

    return clubs.find((club: SkydiveClub) => {
        return club.name.toLowerCase().includes(clubToFindEscaped) || club.id.includes(clubToFindEscaped);
    });
};

export { findClub };
