import api from "./api";

const _URL = "/hospedagem";

//services de acesso a pontos de api referente a reservations
export const getReservations = async () => {
  try {
    const response = await api.get(`${_URL}/reservas`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservationsByAccommodation = async (idAccommodation, localDateTime) => {
  try {
    const response = await api.get(`${_URL}/agenda/${idAccommodation}/${localDateTime}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservationById = async (idReservation) => {
  try {
    const response = await api.get(`${_URL}/reservas/${idReservation}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (reservation) => {
  try {
    const response = await api.post(`${_URL}/reservas`, reservation);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReservation = async (idReservation, reservation) => {
  try {
    const response = await api.put(`${_URL}/reservas/${idReservation}`, reservation);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (idReservation, status) => {
  try {
    const response = await api.put(`${_URL}/reservas/${idReservation}/${status}`, status);
    return response.data;
  } catch (error) {
    throw error;
  }
};