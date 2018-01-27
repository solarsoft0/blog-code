import { isFSA } from 'flux-standard-action';

/*
 * The initial state for this module.
 */
const initialState = [];

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
        case '@tasks:save':
            if ('taskId' in payload && state.findIndex(t => t.taskId === payload.taskId) >= 0) {
                // Existing item - save over the top
                return state.map(t => t.taskId === payload.taskId ? payload : t);
            } else {
                // New item - add to the end
                return [ ...state, payload ];
            }
        case '@tasks:delete':
            // Return a new array without the specified item
            return state.filter(t => t.taskId !== payload.taskId);
    }

    // If it didn't match one of the known types, then just return the state
    return state;
};

export default reducer;
