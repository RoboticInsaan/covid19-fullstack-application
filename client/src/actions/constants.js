// Action Types
export const FETCH_CORONA_STATISTICS = 'FETCH_CORONA_STATISTICS';
export const SHOW_COUNTRY_STATISTICS = 'SHOW_COUNTRY_STATISTICS';
export const FETCH_MARKERS = 'FETCH_MARKERS';
export const MAP_STYLE = 'MAP_STYLE';
export const SET_ACTION = 'SET_ACTION';
export const MAP_STYLE_ACTION = 'MAP_STYLE_ACTION';
export const MAP_FLY_ACTION = 'MAP_FLY_ACTION';

// Environment Variables (Use for flexibility)
export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:9000';
export const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_API_TOKEN';