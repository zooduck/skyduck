/* eslint-disable no-console */
require('dotenv').config();
const axios = require('axios');
const bingGeocodeEndpoint = 'http://dev.virtualearth.net/REST/v1/Locations/';
const fs = require('fs');
const { DateTime } = require('luxon');
const cache = require('./cache');

let db;

const root = {
    path: '/',
    callback: (_request, response) => {
        response.status(200).send({ message: 'Connection Success' });
    }
};

const connect = {
    path: '/connect',
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
            response.status(403).send('CONNECT_LIMIT_EXCEEDED');

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
            response.status(200).send('HALLO_DOMPER');
        } catch (err) {
            console.error(err);
            response.status(404).send(err.message);
        }
    }
};

const geocode = {
    path: '/geocode',
    callback: async (request, response) => {
        axios.get(bingGeocodeEndpoint, {
            params: {
                key: process.env.BING_MAPS_KEY,
                q: request.query.place,
                maxRes: 1,
            },
        }).then((result) => {
            response.status(200).send(JSON.stringify(result.data));
        }).catch((err) => {
            response.status(400).send(err);
        });
    }
};

const reverseGeocode = {
    path: '/reverse_geocode',
    callback: async (request, response) => {
        axios.get(`${bingGeocodeEndpoint}/${request.query.point}`, {
            params: {
                key: process.env.BING_MAPS_KEY,
                maxRes: 1,
            },
        }).then((result) => {
            response.status(200).send(JSON.stringify(result.data));
        }).catch((err) => {
            response.status(404).send(err);
        });
    }
};

const googleMapsKey = {
    path: '/googlemapskey',
    callback: (_request, response) => {
        response.status(200).send(process.env.GOOGLE_MAPS_KEY);
    }
};

const version = {
    path: '/version',
    callback: (_request, response) => {
        try {
            const packageJson = fs.readFileSync('./package.json', 'utf-8');
            const version = JSON.parse(packageJson).version;
            response.status(200).send(version);
        } catch (err) {
            console.error(err.message);
            response.status(404).send(err.message);
        }
    }
};

const weather = {
    path: '/weather',
    callback: async (request, response) => {
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
            if (result) {
                response.status(200).send(JSON.stringify(result));
            } else {
                response.status(404).send(JSON.stringify({ error: 'Document not found' }));
            }
        } catch (err) {
            console.error(err);
            response.status(404).send(err);
        }
    }
};

const weatherPost = {
    path: '/weather',
    callback: async (request, response) => {
        const doc = request.body;
        try {
            await db.collection('Weather').insertOne(doc);
            response.status(200).send(doc);
        } catch (err) {
            console.error(err);
            response.status(404).send(err);
        }
    }
};

const weatherPut = {
    path: '/weather',
    callback: async (request, response) =>  {
        const doc = request.body;
        const { id, daily, requestTime } = doc;
        try {
            await db.collection('Weather').updateOne({ id: id }, {
                $set: {
                    daily,
                    requestTime,
                }
            });
            response.status(200).send(doc);
        } catch (err) {
            console.error(err);
            response.status(404).send(err);
        }
    }
};

const skydiveClubPost = {
    path: '/skydive_club',
    callback: async (request, response) => {
        const doc = request.body;
        try {
            await db.collection('SkydiveClub').insertOne(doc);
            response.status(200).send(doc);
        } catch (err) {
            console.error(err);
            response.status(404).send(err);
        }
    }
};

const routes = {
    get: [
        root,
        connect,
        geocode,
        googleMapsKey,
        reverseGeocode,
        version,
        weather,
    ],
    post: [
        weatherPost,
        skydiveClubPost,
    ],
    put: [
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
