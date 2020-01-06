import { weatherRatings } from './weather-ratings';
import { DateTime } from 'luxon';

describe('weatherRatings', () => {
    let ratingsExample;
    let cloudCover;
    let windSpeed;
    let windGust;
    let precipProbability;
    let sunset;
    let visibility;

    describe('average', () => {
        it('should return a `green` average rating', () => {

            ratingsExample = [
                ['green', 'green'],
                ['green', 'green'],
                ['green', 'green'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('green');

            ratingsExample = [
                ['green', 'green'],
                ['green', 'green'],
                ['green', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('green');

            ratingsExample = [
                ['green', 'green'],
                ['green', 'amber'],
                ['red', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('green');

            ratingsExample = [
                ['green', 'green'],
                ['amber', 'amber'],
                ['red', 'red'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('green');
        });

        it('should return an `amber` average rating', () => {
            ratingsExample = [
                ['green', 'green'],
                ['green', 'amber'],
                ['green', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('amber');

            ratingsExample = [
                ['red', 'amber'],
                ['green', 'amber'],
                ['green', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('amber');

            ratingsExample = [
                ['red', 'red'],
                ['green', 'amber'],
                ['green', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('amber');
        });

        it('should return a `red` average rating', () => {
            ratingsExample = [
                ['red', 'green'],
                ['red', 'green'],
                ['green', 'green'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('red');

            ratingsExample = [
                ['red', 'amber'],
                ['red', 'amber'],
                ['amber', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('red');

            ratingsExample = [
                ['red', 'green'],
                ['red', 'green'],
                ['amber', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('red');

            ratingsExample = [
                ['red', 'amber'],
                ['red', 'amber'],
                ['red', 'amber'],
            ];

            expect(weatherRatings.average(ratingsExample)).toEqual('red');
        });
    });

    describe('cloudCover', () => {
        it('should return a `green` rating', () => {
            cloudCover = 0;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('green');

            cloudCover = 49;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            cloudCover = 50;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('amber');

            cloudCover = 74;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            cloudCover = 75;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('red');

            cloudCover = 100;
            expect(weatherRatings.cloudCover(cloudCover)).toEqual('red');
        });
    });

    describe('windSpeed', () => {
        it('should return a `green` rating', () => {
            windSpeed = 0;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('green');

            windSpeed = 19;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            windSpeed = 20;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('amber');

            windSpeed = 24;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            windSpeed = 25;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('red');

            windSpeed = 100;
            expect(weatherRatings.windSpeed(windSpeed)).toEqual('red');
        });
    });

    describe('windGust', () => {
        it('should return a `green` rating', () => {
            windGust = 0;
            expect(weatherRatings.windGust(windGust)).toEqual('green');

            windGust = 19;
            expect(weatherRatings.windGust(windGust)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            windGust = 20;
            expect(weatherRatings.windGust(windGust)).toEqual('amber');

            windGust = 24;
            expect(weatherRatings.windGust(windGust)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            windGust = 25;
            expect(weatherRatings.windGust(windGust)).toEqual('red');

            windGust = 100;
            expect(weatherRatings.windGust(windGust)).toEqual('red');
        });
    });

    describe('precipProbability', () => {
        it('should return a `green` rating', () => {
            precipProbability = 0;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('green');

            precipProbability = 19;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            precipProbability = 20;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('amber');

            precipProbability = 49;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            precipProbability = 50;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('red');

            precipProbability = 100;
            expect(weatherRatings.precipProbability(precipProbability)).toEqual('red');
        });
    });

    describe('sunset', () => {
        const timezone = 'Europe/London';
        let hour;

        it('should return a `green` rating', () => {
            hour = 19;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('green');

            hour = 23;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            hour = 16;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('amber');

            hour = 17;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            hour = 0;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('red');

            hour = 15;
            sunset = DateTime.local(2017, 5, 25, hour).setZone(timezone).toSeconds();
            expect(weatherRatings.sunset(sunset, timezone)).toEqual('red');
        });
    });

    describe('visibility', () => {
        it('should return a `green` rating', () => {
            visibility = 5;
            expect(weatherRatings.visibility(visibility)).toEqual('green');

            visibility = 10;
            expect(weatherRatings.visibility(visibility)).toEqual('green');
        });

        it('should return an `amber` rating', () => {
            visibility = 3;
            expect(weatherRatings.visibility(visibility)).toEqual('amber');

            visibility = 4;
            expect(weatherRatings.visibility(visibility)).toEqual('amber');
        });

        it('should return a `red` rating', () => {
            visibility = 0;
            expect(weatherRatings.visibility(visibility)).toEqual('red');

            visibility = 2;
            expect(weatherRatings.visibility(visibility)).toEqual('red');
        });
    });
});
