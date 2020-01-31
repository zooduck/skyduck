import { LoaderInfoElements } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const clearLoaderInfoDisplay = function clearLoaderInfoDisplay(loaderInfoElements: LoaderInfoElements) {
    const {
        loaderInfoLat,
        loaderInfoLon,
        loaderInfoPlace,
        loaderInfoIANA,
        loaderInfoLocalTime,
    } = loaderInfoElements;

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
