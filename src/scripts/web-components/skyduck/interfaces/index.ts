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
    time: number;
    sunriseTime: number;
    sunsetTime: number;
    summary: string;
    icon: string;
    precipProbability: number;
    precipType: string;
    temperatureMin: number;
    temperatureMax: number;
    apparentTemperatureMin: number;
    apparentTemperatureMax: number;
    humidity: number;
    windSpeed: number;
    windGust: number;
    windBearing: number;
    cloudCover: number;
    visibility: number;
    hourly: HourlyData[];
}

export interface DailyForecast {
    query: string;
    club: SkydiveClub;
    weather: Weather|SkydiveClubWeather;
    countryRegion?: any;
}

export interface ForecastData {
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

export interface ModifierClasses {
    error: string;
    init: string;
    ready: string;
}

export interface SetContentOptions {
    useLoader: boolean;
}

export interface SkydiveClub {
    id: string;
    name: string;
    place: string;
    country: string;
    latitude: number;
    longitude: number;
    site: string;
}

export interface SkydiveClubWeather {
    id: string;
    name: string;
    place: string;
    site: string;
    weather: Weather;
    requestTime: number;
}

export interface Weather {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: Daily;
    hourly?: Hourly;
    requestTime?: number;
}

export interface WeatherElements {
    footer: HTMLElement;
    forecast: HTMLElement;
    forecastDisplayModeToggle: HTMLElement;
    locationInfo: HTMLElement;
    header: HTMLElement;
    search: HTMLElement;
}

export interface WeatherImageMap {
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
