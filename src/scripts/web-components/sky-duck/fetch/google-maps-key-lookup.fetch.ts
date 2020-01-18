export const googleMapsKeyLookup = async () => {
    try {
        const response =  await fetch('/googlemapskey');
        const key = response.ok
            ? await response.text()
            : '';

        return key;
    } catch (err) {
        throw Error(err);
    }
};
