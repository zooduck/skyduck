// eslint-disable-next-line no-unused-vars
import { SkydiveClub } from '../interfaces/index';
import { StateAPotamus } from '../state/stateapotamus';
import { findClub } from './find-club';

export const getClubData = function getClubData(): SkydiveClub {
    const { club, clubs } = StateAPotamus.getState();

    if (!club || !clubs) {
        return;
    }

    return findClub(clubs, club);
};
