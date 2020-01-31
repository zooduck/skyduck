import { Rating } from '../../interfaces/index'; // eslint-disable-line no-unused-vars
import { DateTime } from 'luxon';

export const weatherRatings = (() => {
    const getDominantFraction = (fractions: number[]) => {
        fractions.sort((a: number, b: number) => {
            return b - a;
        });

        return fractions[0];
    };

    const round = (float: number, decimalPlaces = 2): number => {
        const numberString = float.toString();
        const floatString = parseFloat(numberString).toFixed(decimalPlaces);

        return Number(floatString);
    };

    return {
        average(ratings: Rating[]): Rating {
            // ----------------------------------------------------
            // Formula: If any colour is 50% return `amber`
            // else return the colour with the highest percentage
            // ----------------------------------------------------
            const reds = ratings.filter((rating: Rating) => rating === 'red');
            const ambers = ratings.filter((rating: Rating) => rating === 'amber');
            const greens = ratings.filter((rating) => rating === 'green');
            const totalRatings = reds.length + ambers.length + greens.length;

            const redsFraction = round(reds.length / totalRatings);
            const ambersFraction = round(ambers.length / totalRatings);
            const greensFraction = round(greens.length / totalRatings);

            const fractions = [
                {
                    colour: 'red',
                    fraction: redsFraction
                },
                {
                    colour: 'amber',
                    fraction: ambersFraction,
                },
                {
                    colour: 'green',
                    fraction: greensFraction,
                },
            ];

            const fiftyPercentFraction = fractions.find((fractionData) => {
                return fractionData.fraction === 0.5;
            });

            if (fiftyPercentFraction) {
                return 'amber';
            }

            const dominantFraction = getDominantFraction([
                redsFraction,
                ambersFraction,
                greensFraction,
            ]);

            const dominantColour = fractions.find((fractionData: any) => {
                return fractionData.fraction === dominantFraction;
            }).colour as Rating;

            return dominantColour;
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
            return precipProbability < 20
                ? 'green'
                : precipProbability < 50
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
            return visibility > 4
                ? 'green'
                : visibility > 2
                    ? 'amber'
                    : 'red';
        },
    };
})();
