import { HourlyData, ColorModifier, Rating } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { weatherRatings } from './weather-ratings/weather-ratings';

export  const averageRatingModifierForDay = (hourlyData: HourlyData[]): ColorModifier => {
    const hourlyRatings = hourlyData.map((hour: HourlyData): Rating[] => {
        const { cloudCover, windGust } = hour;

        return [
            weatherRatings.cloudCover(cloudCover),
            weatherRatings.windGust(windGust),
        ];
    });
    const averageRatingModifier = `--${weatherRatings.average(hourlyRatings)}` as ColorModifier;

    return averageRatingModifier;
};
