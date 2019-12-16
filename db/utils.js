const { DateTime } = require('luxon');

const escapeSpecialChars = (query) => {
    let queryEscaped = query;
    const specialChars = ['[', ']', '/', '^', '$', '?', '*', '(', ')'];
    specialChars.forEach((specialChar) => {
        queryEscaped = queryEscaped.replace(new RegExp('\\' + specialChar, 'g'), `\\${specialChar}`);
    });

    return queryEscaped;
};

const isHourlyDataMissing = (data = { date: '', requiredHours: [], hourlyData: [], timezone: '', }) => {
    const { date, requiredHours, hourlyData, timezone } = data;

    const requiredHoursFound = hourlyData.filter((hourlyItem) => {
        const hourlyItemDateTime = DateTime.fromSeconds(hourlyItem.time).setZone(timezone);
        const hourlyItemDate = hourlyItemDateTime.toLocaleString(DateTime.DATE_SHORT);
        const hourlyItemHour = hourlyItemDateTime.hour;

        return hourlyItemDate === date && requiredHours.includes(hourlyItemHour);
    });

    return requiredHoursFound.length < requiredHours.length;
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
    isHourlyDataMissing,
    mergeTimeMachineResults,
};
