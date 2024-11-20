import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers';

// Create Store using Redux Toolkit's configureStore
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if needed for non-serializable data
    }).concat(thunk, logger),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development mode
});

export default store;
