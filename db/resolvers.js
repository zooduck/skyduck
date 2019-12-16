const axios = require('axios');
const { DateTime } = require('luxon');
const {
    escapeSpecialChars,
    isHourlyDataMissing,
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

            const { timezone } = result.data;
            const now = DateTime.local().setZone(timezone);
            const sevenDaysFromNow = now.plus({ days: 7 });
            const nowSeconds = Math.round(now.toSeconds());
            const sevenDaysFromNowSeconds = Math.round(sevenDaysFromNow.toSeconds());
            const requiredHours = [9, 12, 15];
            const hourlyData = result.data.hourly.data;

            const timeMachineRequestForTodayRequired = isHourlyDataMissing({
                date: now.toLocaleString(DateTime.DATE_SHORT),
                requiredHours,
                hourlyData,
                timezone,
            });

            const timeMachineRequestForLastDayRequired = isHourlyDataMissing({
                date: sevenDaysFromNow.toLocaleString(DateTime.DATE_SHORT),
                requiredHours,
                hourlyData,
                timezone,
            });

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

            return result.data;
        }
    };
};

module.exports = resolvers;
