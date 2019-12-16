export const style = (transitionSpeedInMillis: number): string => {
    return `
        :host {
            display: block;
            min-height: 100vh;
            overflow: hidden;
            touch-action: pan-y;
            cursor: pointer;
        }
        ::slotted([slot=slides]) {
            display: flex;
        }
        ::slotted([slot=slides]:not(.--touch-active)) {
            transition: all ${transitionSpeedInMillis}ms;
        }
    `;
};
