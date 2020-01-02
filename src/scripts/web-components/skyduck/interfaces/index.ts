export type ColorModifier = '--red'|'--amber'|'--green';
export type SearchType = 'club'|'location';
export type Rating = 'red'|'amber'|'green';

export interface ClubListSorted {
    country: string;
    furthestDZDistance: number;
    list: SkydiveClub[];
}

export type ClubListsSortedByCountry = {
    [key: string]: ClubListSorted;
}

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
    query: string;
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

export interface FormattedWeather {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: Daily;
    requestTime: number;
}

export interface GeocodeData {
    locationQuery: string;
    name: string;
    address: any;
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

export interface ImageMap {
    'clear-day': string,
    'clear-night': string;
    cloudy: string;
    default: string;
    fog: string;
    'partly-cloudy-day': string;
    rain: string;
    'skyduck-logo': string;
    sleet: string;
    snow: string;
    wind: string;
}

export interface LocationDetails {
    name: string;
    address: string;
    timezone: string;
    coords: Coords;
    site?: string;
}

export interface ModifierClasses {
    error: string;
    init: string;
    ready: string;
}

export interface SetContentOptions {
    useLoader: boolean;
}

export interface SkydiveClub {
    distance?: number;
    id: string;
    name: string;
    place: string;
    country: string;
    latitude: number;
    longitude: number;
    site: string;
}

export interface WeatherElements {
    clubList: HTMLElement;
    footer: HTMLElement;
    forecast: HTMLElement;
    forecastDisplayModeToggle: HTMLElement;
    locationInfo: HTMLElement;
    header: HTMLElement;
    search: HTMLElement;
}

export interface HTMLZooduckCarouselElement extends HTMLElement {
    updateCarouselHeight: any;
}
