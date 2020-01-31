import { wait } from './wait/wait';
import { DateTime } from 'luxon';
import { LatLonSpin } from './lat-lon-spin';
import { LoaderInfoElements, DailyForecast } from '../interfaces/index'; // eslint-disable-line no-unused-vars
import { StateAPotamus } from '../state/stateapotamus';

export const setLoaderInfoDisplay = async function setLoaderInfoDisplay(
    forecast: DailyForecast,
    loaderInfoElements: LoaderInfoElements): Promise<void> {
    const { currentClub } = StateAPotamus.getState();
    const { weather, formattedAddress, countryRegion } = forecast;
    const { latitude, longitude, timezone } = weather;
    const delayBetweenInfoMessages = 500;
    const latLonSpin = new LatLonSpin();

    const place = currentClub
        ? currentClub.place
        : `${formattedAddress},${countryRegion}`;

    const {
        loaderInfoLat,
        loaderInfoLon,
        loaderInfoPlace,
        loaderInfoIANA,
        loaderInfoLocalTime,
    } = loaderInfoElements;

    const locationTime = DateTime.local()
        .setZone(timezone)
        .toLocaleString(DateTime.TIME_24_SIMPLE);

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

    loaderInfoLocalTime.innerHTML = `Local Time: ${locationTime}`;
    await wait(delayBetweenInfoMessages);
};
