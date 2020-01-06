import { Coords } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export class GoogleMapTemplate {
    private _coords: Coords;
    private _googleMap: HTMLIFrameElement;
    private _googleMapsKey: string;

    constructor(googleMapsKey: string, coords: Coords) {
        this._googleMapsKey = googleMapsKey;
        this._coords = coords;
        this._buildGoogleMap();
    }

    private _buildGoogleMap(): void {
        const params = {
            key: this._googleMapsKey,
            q: `${this._coords.latitude},${this._coords.longitude}`,
            zoom: '8',
            center: `${this._coords.latitude},${this._coords.longitude}`,
            maptype: 'roadmap',
        };
        const queryString = new URLSearchParams(params).toString();
        const url = `https://google.com/maps/embed/v1/place?${queryString}`;
        this._googleMap = new DOMParser().parseFromString(
            `<iframe src="${url}" frameborder="0" class="club-info-grid__map"></iframe>
        `, 'text/html').body.firstChild as HTMLIFrameElement;
    }

    public get html(): HTMLIFrameElement {
        return this._googleMap;
    }
}
