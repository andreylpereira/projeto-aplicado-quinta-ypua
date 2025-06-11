import api, { getUserIdFromToken } from "./api";

const _URL = "/hospedagem";

//services de acesso a pontos de api referente a accommodations
export const getAccommodations = async () => {
  try {
    const response = await api.get(`${_URL}/acomodacoes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccommodationById = async (idAccommodation) => {
  try {
    const response = await api.get(`${_URL}/acomodacoes/${idAccommodation}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccommodation = async (accommodation) => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.post(
      `${_URL}/${idUser}/acomodacoes`,
      accommodation
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccommodation = async (idAccommodation, accommodation) => {
  const idUser = getUserIdFromToken();
  try {
    const response = await api.put(
      `${_URL}/${idUser}/acomodacoes/${idAccommodation}`,
      accommodation
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEnable = async (idAccommodation, isEnable) => {
  try {
    const response = await api.put(
      `${_URL}/acomodacoes/${idAccommodation}/${isEnable}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
