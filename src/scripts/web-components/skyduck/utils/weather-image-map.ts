import { WeatherImageMap } from '../interfaces/index'; // eslint-disable-line no-unused-vars

const s3Path = 'https://skyduck.s3.eu-west-2.amazonaws.com';

export const weatherImageMap: WeatherImageMap = {
    'clear-day': `${s3Path}/img/clear-day.jpg`,
    'clear-night': `${s3Path}/img/clear-night.jpg`,
    cloudy: `${s3Path}/img/cloudy.jpg`,
    default: `${s3Path}/img/partly-cloudy-day.jpg`,
    fog: `${s3Path}/img/fog.jpg`,
    'partly-cloudy-day': `${s3Path}/img/partly-cloudy-day.jpg`,
    rain: `${s3Path}/img/rain.jpg`,
    sleet: `${s3Path}/img/sleet.jpg`,
    snow: `${s3Path}/img/snow.jpg`,
    wind: `${s3Path}/img/wind.jpg`,
};
