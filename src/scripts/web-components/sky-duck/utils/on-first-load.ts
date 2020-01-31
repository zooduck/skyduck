import { addStyleAndLoader } from './add-style-and-loader';
import { addSettings } from './add-settings';
import { setStyleOnElement } from './set-style-on-element';
import { wait } from './wait/wait';

const firstLoadDelayMillis = 5000;

export const onFirstLoad = async function onFirstLoad() {
    addStyleAndLoader.call(this);
    addSettings.call(this);

    const loaderBarInner = this.shadowRoot.querySelector('#loaderBarInner');

    setStyleOnElement(loaderBarInner, {
        animationFillMode: 'forwards',
        animationDuration: `${firstLoadDelayMillis}ms`,
    });

    await wait(firstLoadDelayMillis);
};
