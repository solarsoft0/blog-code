import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    blacklist: [ 'auth' ],
    storage
}

const persistedReducers = persistCombineReducers(persistConfig, reducers);
const store = createStore(persistedReducers);
const persistor = persistStore(store);

export {
    persistor,
    store
};
