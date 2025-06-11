import isEqual from "lodash/isEqual";

import {
  FETCH_ACCOMMODATIONS_REQUEST,
  FETCH_ACCOMMODATIONS_SUCCESS,
  FETCH_ACCOMMODATIONS_FAILURE,

} from "../types/actionTypes";

const initialState = {
  accommodations: [],
  error: null,
  loading: true,
};

//Reducers de listagem de accommodation
const accommodationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOMMODATIONS_REQUEST:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case FETCH_ACCOMMODATIONS_SUCCESS: {
      if (isEqual(state.accommodations, action.payload)) {
        return {
          ...state,
          loading: false,
          error: null,
        };
      }
      return {
        ...state,
        accommodations: action.payload,
        loading: false,
        error: null,
      };
    }
    case FETCH_ACCOMMODATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        accommodations: state.accommodations.map((acc) =>
          acc.id === action.payload.id ? action.payload : acc
        ),
      };
    default:
      return state;
  }
};

export default accommodationReducer;