import React from 'react';
import './App.css';

import { Provider } from 'react-redux';
import store from './store';

import CoronaStatisticsProvider from './components/statistics/CoronaStatisticsProvider';
import MapProvider from './components/map/MapProvider';

const App = () => {
  return (
    <Provider store={store}>
      <MapProvider />
      <CoronaStatisticsProvider />
    </Provider>
  );
};

export default App;
