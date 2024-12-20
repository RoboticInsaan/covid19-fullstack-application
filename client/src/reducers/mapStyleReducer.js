import { MAP_STYLE } from '../actions/constants';

const initialState = {
  style: 'mapbox://styles/hackbotone/ck8vtayrp0x5f1io3sakcmpnv',
};

const mapStyleReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_STYLE:
      return {
        ...state,
        style: action.payload,
      };
    default:
      return state;
  }
};

export default mapStyleReducer;
