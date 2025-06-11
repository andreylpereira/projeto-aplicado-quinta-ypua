import api, { getUserIdFromToken } from "./api";

const _URL = "/hospedagem";

//services de acesso a pontos de api referente a amenities
export const getAmenities = async () => {
  try {
    const response = await api.get(`${_URL}/amenidades`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAmenityById = async (idAmenity) => {
  try {
    const response = await api.get(`${_URL}/amenidades/{idAmenity}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAmenity = async (amenity) => {
  const idUser = getUserIdFromToken();
  if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.post(`${_URL}/${idUser}/amenidades`, amenity);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAmenity = async (idAmenity, amenity) => {
  const idUser = getUserIdFromToken();
 if (!idUser) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await api.put(`${_URL}/${idUser}/amenidades/${idAmenity}`, amenity);
    return response.data;
  } catch (error) {
    throw error;
  }
};
