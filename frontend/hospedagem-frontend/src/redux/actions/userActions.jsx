import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "../types/actionTypes.jsx";

import {
  getUsers,
  createUser,
  updateAuthorization,
} from "./../../services/userService";

//Actions de listagem, criação e atualização de users
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });

  try {
    const users = await getUsers();
    dispatch({
      type: FETCH_USERS_SUCCESS,
      payload: users,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: "Erro ao carregar usuários. Tente novamente mais tarde.",
    });
  }
};

export const createUserAction = (user) => async (dispatch) => {
  try {
    const newUser = await createUser(user);
    dispatch({
      type: CREATE_USER_SUCCESS,
      payload: newUser,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserAuthorizationAction = (idUser, newAuthorization) => {
  return async (dispatch) => {
    try {
      const result = await updateAuthorization(idUser, newAuthorization);

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { ...result, habilitado: newAuthorization },
      });
    } catch (error) {
      throw error;
    }
  };
};
