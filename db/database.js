/* eslint-disable no-console */
require('dotenv').config();
const mongodb = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI_ATLAS;
const collections = [
    'Log',
    'SkydiveClub',
    'Weather',
];

const createCollections = (db) => {
    collections.forEach((collection) => {
        db.createCollection(collection, {}, () => {});
    });
};

const mongo = () => {
    return {
        async connect() {
            return new Promise((resolve, reject) => {
                mongodb.connect(mongodbURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, async (err, client) =>  {
                    if (err) {
                        return reject(err);
                    }

                    const db = client.db(process.env.MONGODB_DATABASE);

                    createCollections(db);

                    await db.collection('Log').createIndex({ ip: 1 }, { unique: true });
                    await db.collection('SkydiveClub').createIndex({ id: 1 }, {unique: true });
                    await db.collection('Weather').createIndex({ latitude: 1, longitude: 1 }, { unique: true });

                    resolve(db);
                });
            });
        }
    };
};

module.exports = mongo;
