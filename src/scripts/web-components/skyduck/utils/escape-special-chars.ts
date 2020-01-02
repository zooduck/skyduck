export const escapeSpecialChars = (query) => {
    let queryEscaped = query;
    const specialChars = ['[', ']', '/', '^', '$', '?', '*', '(', ')'];
    specialChars.forEach((specialChar) => {
        queryEscaped = queryEscaped.replace(new RegExp('\\' + specialChar, 'g'), `\\${specialChar}`);
    });

    return queryEscaped;
};
