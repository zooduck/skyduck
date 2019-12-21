export type ColorModifier = '--red'|'--amber'|'--green';
export type SearchType = 'club'|'location';
export type Rating = 'red'|'amber'|'green';
export type Ratings = Rating[];

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
    weather: {
        daily: {
            summary: string;
            icon: string;
            data: any[];
        }
        latitude: number;
        longitude: number;
        timezone: string;
        requestTime?: number;
    }
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
    ready: string;
    error: string;
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
    distance?: number;
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
