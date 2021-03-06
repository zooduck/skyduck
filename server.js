/* eslint-disable no-console */
const express = require('express');
const expressGraphql = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const database = require('./db/database')();
const server = express();
const bodyParser = require('body-parser');
const router = require('./routes.js');

server.enable('trust proxy');
server.use((request, response, next) => {
    if (!request.secure && request.hostname !== 'localhost') {
        console.log('Redirect to https...');

        const secureSite = `https://${request.headers.host}${request.url}`;
        return response.redirect(secureSite);
    }

    next();
});
server.use(express.static('dist'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

let db, resolvers;
const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema.graphql'), 'utf-8');
const schema = buildSchema(typeDefs);

database.connect().then((result) => {
    db = result;
    resolvers = require('./graphql/resolvers')(db);
    console.log(`MongoDB connection to the ${db.databaseName} database was successful`);

    server.use('/graphql', expressGraphql({
        schema,
        rootValue: resolvers,
        graphiql: true,
    }));

    router(server, db);
}).catch((err) => {
    console.error(err);
});


const serverConfig = {
    port: process.env.PORT || 3333, // process.env.PORT (heroku port)
};

server.listen(serverConfig.port, () => {
    console.log(`Server running on http://localhost:${serverConfig.port}`);
    console.log(`GraphQL can be accessed on http://localhost:${serverConfig.port}/graphql`);
});
