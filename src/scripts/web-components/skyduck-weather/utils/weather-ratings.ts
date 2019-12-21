import { Ratings, Rating } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { DateTime } from 'luxon';

export const weatherRatings = (() => {
    const _getDominantColor = (ratings: Rating[], mode: 'optimist'|'realist') => {
        if (!mode || (mode !== 'optimist' && mode !== 'realist')) {
            throw Error('Argument for "mode" is required and the accepted values are "optimist" or "realist".');
        }

        const reds = ratings.filter((rating) => rating === 'red');
        const ambers = ratings.filter((rating) => rating === 'amber');
        const greens = ratings.filter((rating) => rating === 'green');

        const mostlyReds = reds.length > ambers.length && reds.length > greens.length;
        const mostlyAmbers = ambers.length > reds.length && ambers.length > greens.length;
        const mostlyGreens = greens.length > reds.length && greens.length > ambers.length;

        if (mode === 'optimist') {
            return mostlyReds
                ? 'red'
                : mostlyAmbers
                    ? 'amber'
                    : mostlyGreens
                        ? 'green'
                        : greens.length
                            ? 'green'
                            : ambers.length
                                ? 'amber'
                                : 'red';
        }
        if (mode === 'realist') {
            return mostlyReds
                ? 'red'
                : mostlyAmbers
                    ? 'amber'
                    : mostlyGreens
                        ? 'green'
                        : reds.length
                            ? 'red'
                            : ambers.length
                                ? 'amber'
                                : 'green';
        }
    };

    const _getMostDominantRating = (ratings: Rating[][]) =>{
        const mostDominantRatings = ratings.map((ratingsSet) => {
            return _getDominantColor(ratingsSet, 'realist');
        });

        return _getDominantColor(mostDominantRatings, 'optimist');
    };

    return {
        average(ratings: Ratings[]) {
            return _getMostDominantRating(ratings);
        },
        cloudCover(cloudCover: number): Rating {
            return cloudCover < 50
                ? 'green'
                : cloudCover < 75
                    ? 'amber'
                    : 'red';
        },
        windSpeed(windSpeed: number): Rating {
            return windSpeed < 20
                ? 'green'
                : windSpeed < 25
                    ? 'amber'
                    : 'red';
        },
        windGust(windGust: number): Rating {
            return this.windSpeed(windGust);
        },
        precipProbability(precipProbability: number): Rating {
            return precipProbability <= 20
                ? 'green'
                : precipProbability <= 50
                    ? 'amber'
                    : 'red';
        },
        sunset(sunsetTime: number, timezone: string): Rating {
            const dt = DateTime.fromSeconds(sunsetTime).setZone(timezone);
            const sunsetColorModifier = dt.hour < 16
                ? 'red'
                : dt.hour < 18
                    ? 'amber'
                    : 'green';

            return sunsetColorModifier;
        },
        visibility(visibility: number): Rating {
            return visibility >= 5
                ? 'green'
                : visibility >= 3
                    ? 'amber'
                    : 'red';
        },

    };
})();
