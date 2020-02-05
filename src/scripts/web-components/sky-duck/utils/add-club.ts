import { SkydiveClub } from '../interfaces/index'; // eslint-disable-line no-unused-vars

export const addClub = async (data: SkydiveClub) => {
    const method = 'POST';

    const response = await fetch('/skydive_club/add', {
        method,
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
    }

    return response;
};
