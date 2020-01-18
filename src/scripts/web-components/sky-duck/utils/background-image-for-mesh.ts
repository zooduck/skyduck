export const backgroundImageForMesh = (): string => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = 5;
    canvas.height = 5;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255, 255, 255, .2)';
    context.fillRect(1, 1, 3, 3);

    return canvas.toDataURL();
};
