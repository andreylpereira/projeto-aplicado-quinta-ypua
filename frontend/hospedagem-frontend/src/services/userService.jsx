import api, { getUserIdFromToken } from "./api";

const _URL = "/usuario";

//services de acesso a pontos de api referente a users
export const getUsers = async () => {
  try {
    const response = await api.get(`${_URL}/lista`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async () => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.get(`${_URL}/lista/${idUser}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await api.post(`${_URL}/cadastrar`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (password) => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.put(
      `${_URL}/atualizarSenha/${idUser}`,
      password,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAuthorization = async (idUser, isAuthorization) => {
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.put(
      `${_URL}/lista/${idUser}/${isAuthorization}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
