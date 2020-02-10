const { DateTime, Interval } = require('luxon');

const escapeSpecialChars = (query) => {
    let queryEscaped = query;
    const specialChars = ['[', ']', '/', '^', '$', '?', '*', '(', ')'];
    specialChars.forEach((specialChar) => {
        queryEscaped = queryEscaped.replace(new RegExp('\\' + specialChar, 'g'), `\\${specialChar}`);
    });

    return queryEscaped;
};

const filterHourlyDataForDaylightHours = (dailyData, timezone) => {
    const filteredHourlyData = dailyData.hourly.filter((hourlyDataItem) => {
        const { sunriseTime, sunsetTime } = dailyData;
        const requiredInterval = getDaylightHoursInterval(sunriseTime, sunsetTime);
        const hourlyDataItemDate = DateTime.fromSeconds(hourlyDataItem.time).setZone(timezone);

        return requiredInterval.contains(hourlyDataItemDate);
    });

    return filteredHourlyData;
};

const getDaylightHoursInterval = (sunriseTime, sunsetTime) => {
    const sunriseTimeDate = DateTime.fromSeconds(sunriseTime);
    const sunsetTimeDate = DateTime.fromSeconds(sunsetTime);

    const requiredInterval = Interval.fromDateTimes(sunriseTimeDate.minus({ hours: 2 }), sunsetTimeDate.plus({ hours: 2 }));

    return requiredInterval;
};

const hourlyDataExists = (darkSkyData, timeMachineHourlyItem) => {
    return darkSkyData.hourly.data.findIndex((hourlyItem) => {
        const hourlyItemDateTime = DateTime.fromSeconds(hourlyItem.time);
        const timeMachineHourlyItemDateTime = DateTime.fromSeconds(timeMachineHourlyItem.time);
        const hourlyItemDatePlusHour = `${hourlyItemDateTime.toLocaleString(DateTime.DATE_SHORT)}${hourlyItemDateTime.hour}`;
        const timeMachineHourlyItemDatePlusHour = `${timeMachineHourlyItemDateTime.toLocaleString(DateTime.DATE_SHORT)}${timeMachineHourlyItemDateTime.hour}`;

        return hourlyItemDatePlusHour === timeMachineHourlyItemDatePlusHour;
    }) !== -1;
};

const mergeTimeMachineResults = (darkSkyData, darkSkyTimeMachineDataToday, darkSkyTimeMachineDataLastDay) => {
    if (!darkSkyTimeMachineDataToday.hourly.data.length && !darkSkyTimeMachineDataLastDay.hourly.data.length) {
        return darkSkyData;
    }

    if (darkSkyTimeMachineDataToday.daily.data[0]) {
        darkSkyData.daily.data.splice(0, 1, darkSkyTimeMachineDataToday.daily.data[0]);
    }

    if (darkSkyTimeMachineDataLastDay.daily.data[0]) {
        darkSkyData.daily.data.splice(-1, 1, darkSkyTimeMachineDataLastDay.daily.data[0]);
    }

    const missingHourlyDataForToday = darkSkyTimeMachineDataToday.hourly.data.filter((timeMachineHourlyItem) => {
        return !hourlyDataExists(darkSkyData, timeMachineHourlyItem);
    });

    const missingHourlyDataForLastDay = darkSkyTimeMachineDataLastDay.hourly.data.filter((timeMachineHourlyItem) => {
        return !hourlyDataExists(darkSkyData, timeMachineHourlyItem);
    });

    darkSkyData.hourly.data = darkSkyData.hourly.data.concat(missingHourlyDataForToday).concat(missingHourlyDataForLastDay);
    darkSkyData.hourly.data.sort((a, b) => {
        return a.time - b.time;
    });

    return darkSkyData;
};


module.exports = {
    escapeSpecialChars,
    filterHourlyDataForDaylightHours,
    mergeTimeMachineResults,
};
