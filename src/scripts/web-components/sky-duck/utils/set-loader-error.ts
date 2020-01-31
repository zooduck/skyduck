import { StateAPotamus } from '../state/stateapotamus';

export const setLoaderError = function setLoaderError() {
    const { error } = StateAPotamus.getState();

    if (!error) {
        return;
    }

    this.classList.add(this._modifierClasses.error);

    const loaderError =  this.shadowRoot.querySelector('#loaderError');
    loaderError.innerHTML = error;
};
