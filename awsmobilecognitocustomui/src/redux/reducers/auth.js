import { isFSA } from 'flux-standard-action';

/*
 * The initial state for this module.
 */
const initialState = {
    authState: 'unauthenticated',
    authData: {},
};

/**
 * Reducer for the tasks store
 *
 * @param {Object} state the current state of the store
 * @param {FSA} action the action being performed
 * @returns {Object} the new state of the store
 */
const reducer = (state = initialState, action) => {
    if (!isFSA(action))
        return state;

    const payload = action.payload || {};
    switch (action.type) {
        case '@auth:set':
            if ('state' in payload) {
                const data = Object.assign({}, state.authData, payload.data || {});
                return Object.assign({}, state, { authState: payload.state, authData: data });
            } else {
                console.warn(`@auth:set: called without state in payload`);
                return state;
            }
            break;
        case '@auth:profile':
            return Object.assign({}, state, { profile: payload });
    }

    // If it didn't match one of the known types, then just return the state
    return state;
};

export default reducer;
