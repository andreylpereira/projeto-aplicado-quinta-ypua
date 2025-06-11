import {
  FETCH_RESERVATIONS_REQUEST,
  FETCH_RESERVATIONS_SUCCESS,
  FETCH_RESERVATIONS_FAILURE,
  CREATE_RESERVATION_SUCCESS,
  UPDATE_RESERVATION_SUCCESS,
} from "./../types/actionTypes";

const initialState = {
  reservations: [],
  loading: false,
  error: null,
};

//Reducers de listagem, criação e atualização de reservations
const reservationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESERVATIONS_REQUEST:
      return { ...state, loading: true };

    case FETCH_RESERVATIONS_SUCCESS:
      return { ...state, loading: false, reservations: action.payload };

    case FETCH_RESERVATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_RESERVATION_SUCCESS:
      return {
        ...state,
        loading: true,
        reservations: [...state.reservations, action.payload],
      };

    case UPDATE_RESERVATION_SUCCESS:
      return {
        ...state,
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.payload.id
            ? { ...reservation, ...action.payload }
            : reservation
        ),
      };
    default:
      return state;
  }
};

export default reservationReducer;
