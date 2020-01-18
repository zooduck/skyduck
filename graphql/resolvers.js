const axios = require('axios');
const { DateTime, Interval } = require('luxon');
const {
    escapeSpecialChars,
    filterHourlyData,
    mergeTimeMachineResults
} = require('./utils');


const resolvers = (db) => {
    return {
        async club(args) {
            const result = await db.collection('SkydiveClub').findOne({
                $or: [
                    {
                        name: {
                            $regex: escapeSpecialChars(args.name),
                            $options: 'i',
                        }
                    },
                    {
                        place: {
                            $regex: escapeSpecialChars(args.name),
                            $options: 'i',
                        }
                    }
                ]
            });

            return result;
        },
        async clubs(args) {
            const { country } = args;
            const filter = country
                ? {
                    country: {
                        $regex: country,
                        $options: 'i',
                    }
                }
                : {};
            const result = await db.collection('SkydiveClub').find(filter);
            const clubs = await result.toArray();

            return clubs;
        },
        async weather(args) {
            const darkskyURL = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/${args.latitude || '0'},${args.longitude || '0'}`;
            const darkSkyQueryParams = {
                exclude: 'currently,minutely,alerts,flags',
                extend: 'hourly',
                lang: 'en',
                units: 'uk2',
            };
            const darkSkyHeaders = {
                'Accept-Encoding': 'gzip',
            };

            const result = await axios.get(darkskyURL, {
                params: darkSkyQueryParams,
                headers: darkSkyHeaders,
            });

            const { timezone, daily } = result.data;
            const now = DateTime.local().setZone(timezone);
            const sevenDaysFromNow = now.plus({ days: 7 });
            const nowSeconds = Math.round(now.toSeconds());
            const sevenDaysFromNowSeconds = Math.round(sevenDaysFromNow.toSeconds());
            const hourlyData = result.data.hourly.data;

            let twoHoursBeforeSunriseOnTheFirstDay, twoHoursAfterSunsetOnTheLastDay, firstHour, lastHour;
            try {

                firstHour = DateTime.fromSeconds(hourlyData[0].time).setZone(timezone);
                lastHour = DateTime.fromSeconds(hourlyData.slice(-1)[0].time).setZone(timezone);
                twoHoursBeforeSunriseOnTheFirstDay = DateTime.fromSeconds(daily.data[0].sunriseTime).setZone(timezone).minus({ hours: 2 });
                twoHoursAfterSunsetOnTheLastDay = DateTime.fromSeconds(daily.data.slice(-1)[0].sunsetTime).setZone(timezone).plus({ hours: 2 });
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }

            const requiredInterval = Interval.fromDateTimes(twoHoursBeforeSunriseOnTheFirstDay, twoHoursAfterSunsetOnTheLastDay);
            const timeMachineRequestForTodayRequired = requiredInterval.start < firstHour;
            const timeMachineRequestForLastDayRequired = requiredInterval.end > lastHour;

            const emptyData = {
                data: {
                    daily: {
                        data: [],
                    },
                    hourly: {
                        data: [],
                    },
                },
            };

            const timeMachineResultForToday = timeMachineRequestForTodayRequired
                ? await axios.get(`${darkskyURL},${nowSeconds}`, {
                    params: {
                        ...darkSkyQueryParams,
                        extend: null,
                    },
                    headers: darkSkyHeaders,
                })
                : emptyData;

            const timeMachineResultForLastDay = timeMachineRequestForLastDayRequired
                ? await axios.get(`${darkskyURL},${sevenDaysFromNowSeconds}`, {
                    params: {
                        ...darkSkyQueryParams,
                        extend: null,
                    },
                    headers: darkSkyHeaders,
                })
                : emptyData;

            if (timeMachineRequestForTodayRequired || timeMachineRequestForLastDayRequired) {
                mergeTimeMachineResults(result.data, timeMachineResultForToday.data, timeMachineResultForLastDay.data);
            }

            let filteredHourlyData;
            try {
                const { daily, hourly } = result.data;
                filteredHourlyData = filterHourlyData(hourly.data, daily.data, timezone);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }

            if (!filteredHourlyData) {
                return result.data;
            }

            return {
                ...result.data,
                hourly: {
                    ...result.data.hourly,
                    data: filteredHourlyData,
                }
            };
        }
    };
};

module.exports = resolvers;
