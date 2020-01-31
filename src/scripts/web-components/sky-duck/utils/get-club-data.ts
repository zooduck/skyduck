// eslint-disable-next-line no-unused-vars
import { SkydiveClub } from '../interfaces/index';
import { escapeSpecialChars } from './escape-special-chars';
import { StateAPotamus } from '../state/stateapotamus';

export const getClubData = function getClubData(): SkydiveClub {
    const { club, clubs } = StateAPotamus.getState();

    if (!club || !clubs) {
        return;
    }

    const clubEscaped = escapeSpecialChars(club);

    return clubs.find((club: SkydiveClub) => {
        return new RegExp(clubEscaped, 'i').test(club.name);
    });
};
