import AsyncStorage from '@react-native-community/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';

import reducer from './reducer';

// Middleware: Redux Persist Config
const persistConfig = {
	// Root
	key: 'root',
	// Storage Method (React Native)
	storage: AsyncStorage,
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(createLogger()));

// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};
