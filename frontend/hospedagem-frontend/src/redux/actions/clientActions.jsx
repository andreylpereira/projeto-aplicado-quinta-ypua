import {
  FETCH_CLIENTS_REQUEST,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  CREATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_SUCCESS,
} from "../types/actionTypes";
import {
  getClients,
  createClient,
  updateClient,
} from "../../services/clientService";

//Actions de listagem, criação e atualização de clients
export const fetchClients = () => async (dispatch) => {
  dispatch({ type: FETCH_CLIENTS_REQUEST });

  try {
    const clients = await getClients();
    dispatch({
      type: FETCH_CLIENTS_SUCCESS,
      payload: clients,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CLIENTS_FAILURE,
      payload: "Erro ao carregar clientes. Tente novamente mais tarde.",
    });
  }
};

export const createClientAction = (client) => async (dispatch) => {
  try {
    const newClient = await createClient(client);
    dispatch({
      type: CREATE_CLIENT_SUCCESS,
      payload: newClient,
    });
  } catch (error) {
    throw error;
  }
};

export const updateClientAction = (idClient, client) => async (dispatch) => {
  try {
    const updatedClient = await updateClient(idClient, client);

    dispatch({
      type: UPDATE_CLIENT_SUCCESS,
      payload: updatedClient,
    });
  } catch (error) {
    throw error;
  }
};
