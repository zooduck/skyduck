export type ActiveCarousel = 'forecast'|'club-list';

export type ClubCountries = string[];

export interface ClubListSorted {
    country: string;
    countryAliases: string[];
    furthestDZDistance: number;
    list: SkydiveClub[];
}

export type ClubListsSortedByCountry = {
    [key: string]: ClubListSorted;
}

export type ColorModifier = '--red'|'--amber'|'--green';

export interface ColorModifiers {
    cloudCover: ColorModifier;
    windSpeed: ColorModifier;
    windGust: ColorModifier;
    precipProbability: ColorModifier;
    visibility: ColorModifier;
}

export interface ColorModifiersData {
    cloudCover: number;
    windSpeed: number;
    windGust: number;
    temperature: number;
    precipProbability: number;
    visibility: number;
}

export interface Coords {
    latitude: number;
    longitude: number;
}

export interface Daily {
    summary: string;
    icon: string;
    data: DailyData[];
}

export interface DailyData {
    apparentTemperature: number;
    cloudCover: number;
    dateString: string;
    day: string;
    hourly: HourlyData[];
    humidity: number;
    icon: string;
    precipType: string;
    precipProbability: number;
    summary: string;
    temperature: number;
    temperatureMin: number;
    temperatureMax: number;
    timeString: string;
    visibility: number;
    windBearing: number;
    windGust: number;
    windSpeed: number;
    sunriseTime: number;
    sunriseTimeString: string;
    sunsetTime: number;
    sunsetTimeString: string;
}

export interface DailyForecast {
    weather: FormattedWeather;
    countryRegion?: string;
    formattedAddress?: string;
}

export interface DarkSkyWeather {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: Daily;
    hourly: Hourly;
}

export type ForecastType = 'standard'|'extended';

export interface FormattedWeather {
    query: string;
    requestTime: number;
    latitude: number;
    longitude: number;
    timezone: string;
    daily: Daily;
    isFresh?: boolean;
}

export interface GeocodeData {
    query: string;
    name: string;
    address: {
        addressLine: string;
        adminDistrict: string;
        countryRegion: string;
        formattedAddress: string;
        locality: string;
        postalCode: string;
    }
    latitude: number;
    longitude: number;
}

export interface Hourly {
    summary: string;
    icon: string;
    data: HourlyData[];
}

export interface HourlyData {
    cloudCover: number;
    dateString: string;
    timeString: string;
    day: string;
    humidity: number;
    visibility: number;
    windSpeed: number;
    windGust: number;
    temperature: number;
    apparentTemperature: number;
    time: number;
    icon: string;
    precipType: string;
    precipProbability: number;
    summary: string;
}

export interface HTMLZooduckCarouselElement extends HTMLElement {
    currentslide: any;
    updateCarouselHeight: any;
}

export interface ImageMap {
    'clear-day': string,
    'clear-night': string;
    cloudy: string;
    default: string;
    fog: string;
    'partly-cloudy-day': string;
    rain: string;
    sleet: string;
    snow: string;
    wind: string;
}

export type LoaderMessageElements = {
    [key: string]: HTMLElement;
}

export interface LocationDetails {
    name: string;
    address: string;
    timezone: string;
    coords: Coords;
    site?: string;
}

export interface ModifierClasses {
    activeCarouselForecast: string;
    activeCarouselClubList: string;
    error: string;
    forecastDisplayModeExtended: string;
    forecastDisplayModeStandard: string;
    init: string;
    loading: string;
    ready: string;
    settingsActive: string;
    userDeniedGeolocation: string;
}

export type Rating = 'red'|'amber'|'green';

export type SearchType = 'club'|'location';

export interface SetContentOptions {
    useLoader: boolean;
}

export interface Settings {
    activeCarousel: ActiveCarousel;
    forecastDisplayMode: ForecastType;
    locationDetails: LocationDetails;
}

export interface SkydiveClub {
    distance?: number;
    id: string;
    name: string;
    place: string;
    country: string;
    countryAliases: string[];
    latitude: number;
    longitude: number;
    site: string;
}

export interface State {
    currentClubListCountry: string;
    currentForecastSlide: number;
    hasLoaded: boolean;
    headerTitle: string;
    isLoading: boolean;
    googleMapsKey: string;
    settings: Settings;
    settingsActive: boolean;
    userDeniedGeolocation: boolean;
    userLocation: GeocodeData;
    version: string;
}

export interface StateChangeHandlers {
    activeCarousel: any;
    currentForecastSlide: any;
    forecastDisplayMode: any;
    headerTitle: any;
    locationDetails: any;
    settingsActive: any;
}

export type ToggleState = 'on'|'off';

export interface WeatherElements {
    clubList: HTMLElement;
    footer: HTMLElement;
    forecast: HTMLElement;
    forecastExtended: HTMLElement;
    header: HTMLElement;
    headerPlaceholder: HTMLElement;
}
