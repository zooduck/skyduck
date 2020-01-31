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

export interface EventHandlers {
    onClubChangeHandler: CallableFunction;
    onClubListCarouselSlideChangeHandler: CallableFunction;
    onForecastCarouselSlideChangeHandler: CallableFunction;
    toggleSettingsHandler: CallableFunction;
    toggleSubSettingsHandler: CallableFunction;
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

export interface HTMLZooduckInputElement extends HTMLElement {
    disabled: boolean;
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

export type LoaderInfoElements = {
    [key: string]: HTMLElement;
}

export interface LocationDetails {
    name: string;
    address: string;
    timezone?: string;
    coords?: Coords;
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
    subSettingsActive: string;
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
    useGPSForCurrentLocation: boolean;
}

export interface SettingsPageEventHandlers {
    getForecastForCurrentLocationHandler: CallableFunction;
    onLocationChangeHandler: CallableFunction;
    toggleForecastDisplayModeHandler: CallableFunction;
    toggleActiveCarouselHandler: CallableFunction;
    toggleLocationSettingsHandler: CallableFunction;
}

export interface SubSettings {
    LOCATION_SETTINGS: string;
}

export interface SubSettingsLocationSettingsEventHandlers {
    setCurrentLocationHandler: CallableFunction;
    toggleUseGPSForCurrentLocationHandler: CallableFunction;
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
    club: string;
    clubs: SkydiveClub[];
    clubsSortedByCountry: ClubListsSortedByCountry;
    clubCountries: string[];
    currentClub: SkydiveClub;
    currentClubListCountry: string;
    currentForecastSlide: number;
    currentSubSettings: string;
    error: string;
    forecast: DailyForecast;
    geocodeData: GeocodeData;
    googleMapsKey: string;
    hasLoaded: boolean;
    headerSubTitle: string;
    headerTitle: string;
    imagesReady: boolean;
    isLoading: boolean;
    location:  string;
    locationDetails: LocationDetails;
    nearestClub: SkydiveClub;
    position: Position;
    settings: Settings;
    settingsActive: boolean;
    setupStarted: boolean;
    subSettingsActive: boolean;
    userDeniedGeolocation: boolean;
    userLocation: GeocodeData;
    version: string;
}

export interface StateActions {
    CLEAR_ERROR: CallableFunction;
    CLUB_CHANGE: CallableFunction;
    CLUB_LIST_CAROUSEL_SLIDE_CHANGE: CallableFunction;
    ERROR: CallableFunction;
    FORECAST_CAROUSEL_SLIDE_CHANGE: CallableFunction;
    GEOCODE_DATA_CHANGE: CallableFunction;
    GET_FORECAST_BY_CLUB: CallableFunction;
    GET_FORECAST_BY_LOCATION: CallableFunction;
    HAS_LOADED: CallableFunction;
    IMAGES_READY: CallableFunction;
    LOCATION_CHANGE: CallableFunction;
    LOCATION_DETAILS_CHANGE: CallableFunction;
    NEAREST_CLUB_CHANGE: CallableFunction;
    TOGGLE_ACTIVE_CAROUSEL: CallableFunction;
    TOGGLE_FORECAST_DISPLAY_MODE: CallableFunction;
    TOGGLE_SETTINGS: CallableFunction;
    TOGGLE_SUB_SETTINGS: CallableFunction;
    TOGGLE_SUB_SETTINGS_LOCATION_SETTINGS: CallableFunction;
    TOGGLE_USE_GPS_FOR_CURRENT_LOCATION: CallableFunction;
    USER_LOCATION_CHANGE: CallableFunction;
    SET_CLUBS: CallableFunction;
    SET_CURRENT_CLUB: CallableFunction;
    SET_LOADED: CallableFunction;
    SET_LOADING:CallableFunction;
    SET_POSITION: CallableFunction;
    SET_READY: CallableFunction;
    SETUP: CallableFunction;
    SORT_CLUBS: CallableFunction;
    USER_DENIED_GEOLOCATION: CallableFunction;
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
