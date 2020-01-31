// eslint-disable-next-line no-unused-vars
import { SkydiveClub } from '../interfaces/index';

export const sortClubsByDistance = (clubs: SkydiveClub[]): void => {
    clubs.sort((a: SkydiveClub, b: SkydiveClub) => {
        return a.distance - b.distance;
    });
};
