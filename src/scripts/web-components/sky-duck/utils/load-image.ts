export const loadImage = (src: string): Promise<any> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = src;
    });
};
