export const getLoaderInfoElements = function getLoaderInfoElements() {
    const loader = this.shadowRoot.querySelector('#skyduckLoader');

    return {
        loaderInfoLat: loader.querySelector('#loaderInfoLat') as HTMLElement,
        loaderInfoLon: loader.querySelector('#loaderInfoLon') as HTMLElement,
        loaderInfoPlace: loader.querySelector('#loaderInfoPlace') as HTMLElement,
        loaderInfoIANA: loader.querySelector('#loaderInfoIANA') as HTMLElement,
        loaderInfoLocalTime: loader.querySelector('#loaderInfoLocalTime') as HTMLElement,
    };
};
