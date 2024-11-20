import { SHOW_COUNTRY_STATISTICS } from '../actions/constants';

const initialState = {
  statistics: '',
};

const countryStatisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_COUNTRY_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    default:
      return state;
  }
};

export default countryStatisticsReducer;
