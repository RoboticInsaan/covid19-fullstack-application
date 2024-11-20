import { FETCH_CORONA_STATISTICS } from '../actions/constants';

const initialState = {
  results: '',
};

const statisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CORONA_STATISTICS:
      return {
        ...state,
        results: action.payload,
      };
    default:
      return state;
  }
};

export default statisticsReducer;
