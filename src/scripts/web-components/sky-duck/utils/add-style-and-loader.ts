import { StateAPotamus } from '../state/stateapotamus';
import { LoaderTemplate } from '../templates/loader.template';
import { SkyduckStyle } from '../services/skyduck-style';

export const addStyleAndLoader = function addStyleAndLoader() {
    const styleEl = getStyle.call(this);
    const loaderEl = getLoader.call(this);

    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(loaderEl);
};

const getLoader = function getLoader(): HTMLElement {
    const loader = new LoaderTemplate().html;

    loader.addEventListener('click', () => {
        if (!StateAPotamus.getState().error) {
            return;
        }

        StateAPotamus.dispatch('SET_READY');
        StateAPotamus.dispatch('SET_LOADED', {
            isLoading: false,
        });
    });

    return loader;
};

const getStyle = function getStyle(): HTMLStyleElement {
    const style = new SkyduckStyle({
        transitionSpeedInMillis: 250,
    });

    const styleEl = document.createElement('style');

    styleEl.textContent = style.style;

    return styleEl;
};
