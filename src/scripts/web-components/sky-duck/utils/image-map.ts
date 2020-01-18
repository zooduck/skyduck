import { ImageMap } from '../interfaces/index'; // eslint-disable-line no-unused-vars

const S3_BUCKET = 'https://skyduck.s3.eu-west-2.amazonaws.com';

export const imageMap: ImageMap = {
    'clear-day': `${S3_BUCKET}/img/clear-day.jpg`,
    'clear-night': `${S3_BUCKET}/img/clear-night.jpg`,
    cloudy: `${S3_BUCKET}/img/cloudy.jpg`,
    default: `${S3_BUCKET}/img/partly-cloudy-day.jpg`,
    fog: `${S3_BUCKET}/img/fog.jpg`,
    'partly-cloudy-day': `${S3_BUCKET}/img/partly-cloudy-day.jpg`,
    rain: `${S3_BUCKET}/img/rain.jpg`,
    sleet: `${S3_BUCKET}/img/sleet.jpg`,
    snow: `${S3_BUCKET}/img/snow.jpg`,
    wind: `${S3_BUCKET}/img/wind.jpg`,
};
