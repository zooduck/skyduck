export const graphqlConfig = {
    uri: 'http://localhost:3333/graphql',
    options: {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
        }
    }
};
