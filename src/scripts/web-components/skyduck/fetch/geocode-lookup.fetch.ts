export const geocodeLookup = async (place: string): Promise<any> => {
    try {
        const response = await fetch(`/geocode?place=${place}`);

        if (!response.ok) {
            throw(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();
        const resource = json.resourceSets[0].resources[0];

        if (!resource) {
            throw(`Unable to resolve coordinates for location of "${place}."`);
        }

        const coords = resource.geocodePoints[0].coordinates;
        const { name, address } = resource;

        const geocodeData = {
            locationQuery: place,
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
