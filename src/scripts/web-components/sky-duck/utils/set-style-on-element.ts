interface Style {
    [key: string]: string;
}

export const setStyleOnElement = (el: HTMLElement, style: Style) => {
    Object.keys(style).forEach((key) => {
        el.style[key] = style[key];
    });
};
