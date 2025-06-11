import {
  FETCH_CLIENTS_REQUEST,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  CREATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_SUCCESS,
} from "../types/actionTypes";

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

//Reducers de listagem, criação e atualização de clients
const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_CLIENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_CLIENT_SUCCESS:
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };

    case UPDATE_CLIENT_SUCCESS:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        ),
      };

    default:
      return state;
  }
};

export default clientReducer;
