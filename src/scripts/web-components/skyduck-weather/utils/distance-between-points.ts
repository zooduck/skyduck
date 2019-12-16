interface LatLon {
    latDeg: number;
    lonDeg: number;
}

interface Points {
    from: LatLon;
    to: LatLon;
}

export class DistanceBetweenPoints {
    private _distanceInMetres;
    private _distanceInMiles;

    constructor(points: Points) {
        this._distanceInMetres = this._calcDistanceBetweenPointsInMetres(points);
        this._distanceInMiles = this._metresToMiles(this._distanceInMetres);
    }

    private _calcDistanceBetweenPointsInMetres(points: Points) {
        const { latDeg: latDeg1, lonDeg: lonDeg1 } = points.from;
        const { latDeg: latDeg2, lonDeg: lonDeg2 } = points.to;

        const earthRadiusInMetres = 6371000; // metres

        const latRadians1 = this._degreesToRadians(latDeg1);
        const lonRadians1 = this._degreesToRadians(lonDeg1);
        const latRadians2 = this._degreesToRadians(latDeg2);
        const lonRadians2 = this._degreesToRadians(lonDeg2);

        // Spherical Law of Cosines Formula
        // https://www.movable-type.co.uk/scripts/latlong.html
        const distanceInMetres = Math.acos(
            (Math.sin(latRadians1) * Math.sin(latRadians2)) +
            (Math.cos(latRadians1) * Math.cos(latRadians2)) *
            Math.cos(lonRadians2 - lonRadians1)
        ) * earthRadiusInMetres;

        return Math.round(distanceInMetres);
    }

    private _metresToMiles(metres: number) {
        const divisionFactor = 1609.344;

        return Math.round(metres / divisionFactor);
    }

    private _degreesToRadians(deg: number) {
        return deg * (Math.PI / 180);
    }

    public get metres() {
        return this._distanceInMetres;
    }

    public get miles() {
        return this._distanceInMiles;
    }
}
