import { wait } from './wait/wait';
import { DateTime } from 'luxon';
import { LatLonSpin } from './lat-lon-spin';
import { LoaderMessageElements, DailyForecast, SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const setLoaderInfoDisplay = async function setLoaderInfoDisplay(
    forecast: DailyForecast,
    clubData: SkydiveClub,
    loaderMessageElements: LoaderMessageElements): Promise<void> {
    const { weather, formattedAddress, countryRegion } = forecast;
    const { latitude, longitude, timezone } = weather;
    const delayBetweenInfoMessages = 500;
    const latLonSpin = new LatLonSpin();

    const place = clubData
        ? clubData.place
        : `${formattedAddress},${countryRegion}`;

    const {
        loaderInfoLat,
        loaderInfoLon,
        loaderInfoPlace,
        loaderInfoIANA,
        loaderInfoLocalTime,
    } = loaderMessageElements;

    latLonSpin.apply(loaderInfoLat, 'Lat:&nbsp;');
    await wait(delayBetweenInfoMessages);
    latLonSpin.setContent(loaderInfoLat, `Lat: ${latitude.toString().substr(0, 9)}`);

    latLonSpin.apply(loaderInfoLon, 'Lon:&nbsp;');
    await wait(delayBetweenInfoMessages);
    latLonSpin.setContent(loaderInfoLon, `Lon: ${longitude.toString().substr(0, 9)}`);

    loaderInfoPlace.innerHTML = `${place}`;
    await wait(delayBetweenInfoMessages);

    loaderInfoIANA.innerHTML = `${timezone}`;
    await wait(delayBetweenInfoMessages);

    const locationTime = DateTime.local()
        .setZone(timezone)
        .toLocaleString(DateTime.TIME_24_SIMPLE);

    loaderInfoLocalTime.innerHTML = `Local Time: ${locationTime}`;
    await wait(delayBetweenInfoMessages);
};
