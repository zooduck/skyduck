// eslint-disable-next-line no-unused-vars
import { SkydiveClub } from '../interfaces/index';

export const sortClubsByName = (clubs: SkydiveClub[]): void => {
    clubs.sort((a: SkydiveClub, b: SkydiveClub) => {
        return a.name > b.name ? 1 : -1;
    });
};
