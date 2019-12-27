export const reverseGeocodeLookup = async (point: Coordinates): Promise<any> => {
    try {
        const { latitude, longitude } = point;
        const response = await fetch(`/reverse_geocode?point=${latitude},${longitude}`);

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();
        const resource = json.resourceSets[0].resources[0];

        if (!resource) {
            this._geocodeData = null;
            throw(`Unable to resolve location for coordinates of "${latitude},${longitude}."`);
        }

        const coords = resource.geocodePoints[0].coordinates;
        const { name, address } = resource;

        const geocodeData = {
            locationQuery: `Current Location (${latitude},${longitude})`,
            address,
            name,
            latitude: coords[0],
            longitude: coords[1],
        };

        return geocodeData;
    } catch (err) {
        throw Error(err);
    }
};
