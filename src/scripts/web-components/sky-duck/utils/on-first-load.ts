import { addStyleAndLoader } from './add-style-and-loader';
import { addSettings } from './add-settings';
import { wait } from './wait/wait';

const firstLoadDelayMillis = 5000;

export const onFirstLoad = async function onFirstLoad() {
    addStyleAndLoader.call(this);
    addSettings.call(this);

    await wait(firstLoadDelayMillis);
};
