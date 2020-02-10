const axios = require('axios');
const { DateTime, Interval } = require('luxon');
const {
    escapeSpecialChars,
    mergeTimeMachineResults
} = require('../utils/index');


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

            try {
                const firstHour = DateTime.fromSeconds(hourlyData[0].time).setZone(timezone);
                const lastHour = DateTime.fromSeconds(hourlyData.slice(-1)[0].time).setZone(timezone);
                const firstRequiredHour = DateTime.fromSeconds(daily.data[0].time).setZone(timezone).set({ hour: 9});
                const lastRequiredHour = DateTime.fromSeconds(daily.data.slice(-1)[0].time).setZone(timezone).set({ hour: 15 });

                const requiredInterval = Interval.fromDateTimes(firstRequiredHour, lastRequiredHour);
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
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }

            return result.data;
        }
    };
};

module.exports = resolvers;
