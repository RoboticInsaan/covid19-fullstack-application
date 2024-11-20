import { SET_ACTION } from '../actions/constants';

const initialState = {
  action: '',
};

const setActionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTION:
      return {
        ...state,
        action: action.payload,
      };
    default:
      return state;
  }
};

export default setActionReducer;
