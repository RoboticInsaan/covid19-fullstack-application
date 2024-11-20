import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
    FETCH_CORONA_STATISTICS,
    SHOW_COUNTRY_STATISTICS,
    FETCH_MARKERS,
    MAP_STYLE,
    SET_ACTION,
    BASE_URL,
} from './constants';

// Fetch Corona Statistics (Async Thunk)
export const fetchCoronaStatistics = createAsyncThunk(
    FETCH_CORONA_STATISTICS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }
            const data = await response.json();
            return data; // Automatically dispatched as the fulfilled action
        } catch (error) {
            return rejectWithValue(error.message); // Automatically dispatched as the rejected action
        }
    }
);

// Fetch Markers (Async Thunk)
export const fetchMarkers = createAsyncThunk(
    FETCH_MARKERS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}markers.geojson`);
            if (!response.ok) {
                throw new Error('Failed to fetch markers');
            }
            const data = await response.json();
            return data; // Automatically dispatched as the fulfilled action
        } catch (error) {
            return rejectWithValue(error.message); // Automatically dispatched as the rejected action
        }
    }
);

// Show Country Statistics (Sync Action)
export const showCountryStatistics = createAction(SHOW_COUNTRY_STATISTICS, (item) => ({
    payload: { item },
}));

// Set Map Style (Sync Action)
export const setMapStyle = createAction(MAP_STYLE, (style) => ({
    payload: { style },
}));

// Set Action (Sync Action)
export const setAction = createAction(SET_ACTION, (action) => ({
    payload: { action },
}));
