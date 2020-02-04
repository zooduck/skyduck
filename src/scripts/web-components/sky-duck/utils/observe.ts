export const observe = (els: HTMLElement[], intersectionObserverCallback: IntersectionObserverCallback) => {
    const intersectionObsever = new IntersectionObserver(intersectionObserverCallback, {
        root: null,
        threshold: [1]
    });

    els.forEach((el: HTMLElement) => {
        intersectionObsever.observe(el);
    });
};
