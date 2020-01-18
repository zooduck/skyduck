import { HourlyData, ColorModifier, Rating } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { weatherRatings } from './weather-ratings/weather-ratings';

export  const averageRatingModifierForDay = (hourlyData: HourlyData[]): ColorModifier => {
    const ratings: Rating[] = [];
    hourlyData.forEach((hour: HourlyData) => {
        const { cloudCover, windGust } = hour;

        ratings.push(weatherRatings.cloudCover(cloudCover));
        ratings.push(weatherRatings.windGust(windGust));
    });
    const averageRatingModifier = `--${weatherRatings.average(ratings)}` as ColorModifier;

    return averageRatingModifier;
};
