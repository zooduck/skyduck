export const getCurrentPosition = (): Promise<Position> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        }, (err) => {
            reject(err.message || err);
        });
    });
};
