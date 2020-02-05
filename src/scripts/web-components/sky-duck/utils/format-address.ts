export const formatAddress = (address: string): string => {
    const parts = address.split(',');
    const uniqueParts = [];

    parts.forEach((part) => {
        const _part = part.trim();
        if (!uniqueParts.includes(_part)) {
            uniqueParts.push(_part);
        }
    });

    const html = uniqueParts.map((part) => {
        return `<span>${part}</span>`;
    });

    return html.join('');
};
