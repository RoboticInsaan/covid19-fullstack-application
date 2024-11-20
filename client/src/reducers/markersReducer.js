import { FETCH_MARKERS } from '../actions/constants';

const initialState = {
  markers: [],
};

const markersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKERS:
      return {
        ...state,
        markers: action.payload,
      };
    default:
      return state;
  }
};

export default markersReducer;
