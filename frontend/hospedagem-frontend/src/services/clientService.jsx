import api, { getUserIdFromToken } from "./api";

const _URL = "/hospedagem";

//services de acesso a pontos de api referente a clients
export const getClients = async () => {
  try {
    const response = await api.get(`${_URL}/clientes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClientById = async (idClient) => {
  try {
    const response = await api.get(`${_URL}/clientes/${idClient}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClient = async (Client) => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.post(`${_URL}/${idUser}/clientes`, Client);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (idClient, Client) => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.put(
      `${_URL}/${idUser}/clientes/${idClient}`,
      Client
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
