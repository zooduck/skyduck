export const getCurrentPosition = (): Promise<Position> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            resolve(position);
        }, async (err) => {
            reject(err.message || err);
        });
    });
};
