import {
  FETCH_AMENITIES_REQUEST,
  FETCH_AMENITIES_SUCCESS,
  FETCH_AMENITIES_FAILURE,
  CREATE_AMENITY_SUCCESS,
  UPDATE_AMENITY_SUCCESS,
} from "../types/actionTypes";

const initialState = {
  amenities: [],
  loading: false,
  error: null,
};

//Reducers de listagem, criação e atualização de amenities
  const amenityReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_AMENITIES_REQUEST:
        return {
          ...state,
          loading: true,
        };
  
      case FETCH_AMENITIES_SUCCESS:
        return {
          ...state,
          amenities: action.payload,
          loading: false,
          error: null,
        };
  
      case FETCH_AMENITIES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case CREATE_AMENITY_SUCCESS:
        return {
          ...state,
          amenities: [...state.amenities, action.payload],
        };
  
      case UPDATE_AMENITY_SUCCESS:
        return {
          ...state,
          amenities: state.amenities.map((amenity) =>
            amenity.id === action.payload.id ? action.payload : amenity
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default amenityReducer;
  