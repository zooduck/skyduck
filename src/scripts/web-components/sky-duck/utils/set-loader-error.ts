import { StateAPotamus } from '../state/stateapotamus';

export const setLoaderError = function setLoaderError() {
    const { error } = StateAPotamus.getState();

    if (!error) {
        return;
    }

    this.classList.add(this._modifierClasses.error);

    const skyduckLoaderErrorEl =   this.shadowRoot.querySelector('skyduck-loader-error');
    skyduckLoaderErrorEl.setAttribute('message', error);
    skyduckLoaderErrorEl.setAttribute('active', '');
};
