// eslint-disable-next-line no-unused-vars
import { SkydiveClub, GeocodeData } from '../interfaces/index';
import { DistanceBetweenPoints } from './distance-between-points';

export const updateClubDistances = (clubs: SkydiveClub[], userLocation: GeocodeData): SkydiveClub[]  =>{
    return clubs.map((club: SkydiveClub) => {
        const distanceInMiles = userLocation
            ? new DistanceBetweenPoints({
                from: {
                    latDeg: userLocation.latitude,
                    lonDeg: userLocation.longitude,
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
};
