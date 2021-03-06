/* eslint-disable no-console */
const dotenv = require('dotenv');
const axios = require('axios');
const BING_GEOCODE_API = 'http://dev.virtualearth.net/REST/v1/Locations/';
const fs = require('fs');
const { DateTime } = require('luxon');
const { filterHourlyDataForDaylightHours } = require('./utils/index');
const cache = require('./cache');
const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORISED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
};

dotenv.config();

let db;

const root = {
    path: '/',
    callback: (_request, response) => {
        response.status(httpStatusCodes.OK).send({ message: 'Connection Success' });
    }
};

const connectPut = {
    path: '/connect/update',
    callback: async (request, response) => {
        const { ip } = request;
        const { location } = request.query;
        const locations = !location
            ? []
            : [ location ];
        const dt = DateTime.local();
        const connectionTime = dt.toMillis();
        const connectionDateString = dt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
        const oneMinuteAgo = dt.minus({ minutes: 1 }).toMillis();

        const connectDataFromCache = cache.connectRequests.find((item) => {
            return item.ip === ip;
        });

        if (!connectDataFromCache) {
            cache.connectRequests.push({
                ip,
                lastConnectionTime: connectionTime,
            });
        }

        const initialDoc = {
            ip,
            location,
            locations,
            connections: 1,
            lastConnectionTime: connectionTime,
            lastConnectionDateString: connectionDateString,
        };

        const query = {
            ip: ip,
        };

        if (connectDataFromCache && connectDataFromCache.lastConnectionTime > oneMinuteAgo) {
            response.status(httpStatusCodes.FORBIDDEN).send('CONNECT_LIMIT_EXCEEDED');

            return;
        }

        if (connectDataFromCache) {
            connectDataFromCache.lastConnectionTime = connectionTime;
        }

        try {
            const result = await db.collection('Log').findOne(query);
            if (result) {
                const locations = result.locations;
                if (location && !result.locations.includes(location)) {
                    locations.push(location);
                }
                await db.collection('Log').updateOne(query, {
                    $set: {
                        connections: result.connections + 1,
                        location,
                        locations,
                        lastConnectionTime: connectionTime,
                        lastConnectionDateString: connectionDateString,
                    },
                });
            } else {
                await db.collection('Log').insertOne(initialDoc);
            }
            response.status(httpStatusCodes.OK).send('HALLO_DOMPER');
        } catch (err) {
            console.error(err);
            response.status(httpStatusCodes.BAD_REQUEST).send(err.message);
        }
    }
};

const geocode = {
    path: '/geocode',
    callback: async (request, response) => {
        axios.get(BING_GEOCODE_API, {
            params: {
                key: process.env.BING_MAPS_KEY,
                q: request.query.place,
                maxRes: 1,
            },
        }).then((result) => {
            response.status(httpStatusCodes.OK).send(JSON.stringify(result.data));
        }).catch((err) => {
            response.status(httpStatusCodes.BAD_REQUEST).send(err);
        });
    }
};

const reverseGeocode = {
    path: '/reverse_geocode',
    callback: async (request, response) => {
        axios.get(`${BING_GEOCODE_API}/${request.query.point}`, {
            params: {
                key: process.env.BING_MAPS_KEY,
                maxRes: 1,
            },
        }).then((result) => {
            response.status(200).send(JSON.stringify(result.data));
        }).catch((err) => {
            response.status(httpStatusCodes.BAD_REQUEST).send(err);
        });
    }
};

const googleMapsKey = {
    path: '/googlemapskey',
    callback: (_request, response) => {
        response.status(httpStatusCodes.OK).send(process.env.GOOGLE_MAPS_KEY);
    }
};

const version = {
    path: '/version',
    callback: (_request, response) => {
        try {
            const packageJson = fs.readFileSync('./package.json', 'utf-8');
            const version = JSON.parse(packageJson).version;
            response.status(httpStatusCodes.OK).send(version);
        } catch (err) {
            console.error(err.message);
            response.status(httpStatusCodes.BAD_REQUEST).send(err.message);
        }
    }
};

const weather = {
    path: '/weather/find',
    callback: async (request, response) => {
        const { includeNighttimeWeather } = request.query;
        const query = {
            latitude: parseFloat(request.query.latitude),
            longitude: parseFloat(request.query.longitude),
        };
        const options = {
            projection: {
                _id: 0,
            }
        };
        try {
            const result = await db.collection('Weather').findOne(query, options);

            if (!result) {
                response.status(httpStatusCodes.NOT_FOUND).send(JSON.stringify({ error: 'Document not found' }));

                return;
            }

            let filteredResult = result;

            if (includeNighttimeWeather === 'false') {
                const dailyData = result.daily.data.map((dailyDataItem) => {
                    const filteredHourlyData = filterHourlyDataForDaylightHours(dailyDataItem, result.timezone);

                    return {
                        ...dailyDataItem,
                        hourly: filteredHourlyData,
                    };
                });

                filteredResult = {
                    ...result,
                    daily: {
                        ...result.daily,
                        data: dailyData,
                    },
                };
            }

            response.status(httpStatusCodes.OK).send(JSON.stringify(filteredResult));
        } catch (err) {
            console.error(err);
            response.status(httpStatusCodes.BAD_REQUEST).send(err);
        }
    }
};

const weatherPut = {
    path: '/weather/update',
    callback: async (request, response) =>  {
        const doc = request.body;
        const { requestTime, latitude, longitude, daily } = doc;

        try {
            await db.collection('Weather').insertOne(doc);
            response.status(httpStatusCodes.CREATED).send();

            return;
        } catch (err) {
            // Collection already exists, continue...
        }

        try {
            await db.collection('Weather').updateOne({ latitude, longitude }, {
                $set: {
                    daily,
                    requestTime,
                }
            });
            response.status(httpStatusCodes.NO_CONTENT).send();
        } catch (err) {
            console.error(err);
            response.status(httpStatusCodes.BAD_REQUEST).send(err);
        }
    }
};

const skydiveClubPost = {
    path: '/skydive_club/add',
    callback: async (request, response) => {
        const doc = request.body;
        try {
            await db.collection('SkydiveClub').insertOne(doc);
            response.status(httpStatusCodes.CREATED).send(doc);
        } catch (err) {
            console.error(err);
            response.status(httpStatusCodes.BAD_REQUEST).send(err);
        }
    }
};

const routes = {
    get: [
        root,
        geocode,
        googleMapsKey,
        reverseGeocode,
        version,
        weather,
    ],
    post: [
        skydiveClubPost,
    ],
    put: [
        connectPut,
        weatherPut,
    ]
};

const router = (server, database) => {
    db = database;
    routes.get.forEach((config) => {
        server.get(config.path, config.callback);
    });
    routes.post.forEach((config) => {
        server.post(config.path, config.callback);
    });
    routes.put.forEach((config) => {
        server.put(config.path, config.callback);
    });
};

module.exports = router;
