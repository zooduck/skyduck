import { getLoaderInfoElements } from './get-loader-info-elements';

export const resetLoaderMessages = function resetLoaderMessages() {
    const loaderInfoElements = getLoaderInfoElements.call(this);

    Object.keys(loaderInfoElements).forEach((key: string) => {
        loaderInfoElements[key].innerHTML = '';
    });
};
