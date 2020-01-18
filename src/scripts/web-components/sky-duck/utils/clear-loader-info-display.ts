import { LoaderMessageElements } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const clearLoaderInfoDisplay = function clearLoaderInfoDisplay(loaderMessageElements: LoaderMessageElements) {
    const {
        loaderInfoLat,
        loaderInfoLon,
        loaderInfoPlace,
        loaderInfoIANA,
        loaderInfoLocalTime,
    } = loaderMessageElements;

    [
        loaderInfoLat,
        loaderInfoLon,
        loaderInfoPlace,
        loaderInfoIANA,
        loaderInfoLocalTime
    ].forEach((loaderInfoEl: HTMLElement) => {
        loaderInfoEl.innerHTML = '';
    });
};
