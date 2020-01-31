import { imageMap } from './image-map';
import { loadImage } from './load-image';
import { StateAPotamus } from '../state/stateapotamus';

export const getImages = async function getImages(): Promise<void> {
    const imagesLoaded = [];
    return new Promise((resolve) => {
        const imageLinks = Object.keys(imageMap).map((key) => {
            return {
                key,
                url: imageMap[key],
            };
        });

        imageLinks.forEach(async (link) => {
            try {
                await loadImage(link.url);
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            } finally {
                imagesLoaded.push(link.url);
            }

            if (imagesLoaded.length === imageLinks.length) {
                StateAPotamus.dispatch('IMAGES_READY', {
                    imagesReady: true,
                });

                resolve();
            }
        });
    });
};
