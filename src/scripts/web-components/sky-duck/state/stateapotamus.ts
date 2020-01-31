interface Actions {
    [key: string]: CallableFunction;
}

export const StateAPotamus = (() => {
    let _state: any;
    const _actions: Actions = {};
    const _ERROR = (action: string) => {
        return `Error: You attempted to dispatch an unregistered action (${action})!

To register an action:
-------------------------------------------------------------
StateAPotamus.listen(<Action: String>, <Callback: Function>);
-------------------------------------------------------------

To dispatch a registered action:
---------------------------------------------------------------------
StateAPotamus.dispatch(<Action: String>, <NewState: any>);
---------------------------------------------------------------------

For example:
--------------------------------------------------------------------
const initialState = {
    pony: 'Twilight Sparkle',
};

StateAPotamus.setState(initialState);

console.log('Log 1: ' + StateAPotamus.getState().pony);

const onPonyChangeCallback = () => {
    console.log('Log 2: ' + StateAPotamus.getState().pony);
};

StateAPotamus.listen('UPDATE_PONY', onPonyChangeCallback);

const newState = {
    pony: 'Rarity',
};

StateAPotamus.dispatch('UPDATE_PONY', newState);

console.log('Log 3: ' + StateAPotamus.getState().pony);

// Log 1: Twilight Sparkle
// Log 2: Rarity
// Log 3: Rarity
--------------------------------------------------------------------
        `;
    };

    const _validateAction = (action: any): boolean => {
        if (typeof _actions[action] !== 'function') {
            const error = _ERROR(action);
            // eslint-disable-next-line no-console
            console.error(error);

            return false;
        }

        return true;
    };

    return {
        async dispatch(action: string, newState?: Object): Promise<void> {
            if (newState) {
                _state = {
                    ..._state,
                    ...newState
                };
            }

            const isValidAction = _validateAction(action);

            if (!isValidAction) {
                return;
            }

            await _actions[action]();
        },
        listen(action: string, callback: any): void {
            _actions[action] = callback;
        },
        getActions(): Actions {
            return _actions;
        },
        getState(): any {
            return _state;
        },
        setState(newState: any): void {
            _state = {
                ...newState,
            };
        },
    };
})();
