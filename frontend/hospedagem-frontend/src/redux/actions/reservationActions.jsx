import {
    FETCH_RESERVATIONS_REQUEST,
    FETCH_RESERVATIONS_SUCCESS,
    FETCH_RESERVATIONS_FAILURE,
    CREATE_RESERVATION_SUCCESS,
    UPDATE_RESERVATION_SUCCESS
  } from '../types/actionTypes';
  import { getReservationsByAccommodation, createReservation, updateReservation } from "./../../services/reservationService";

//Actions de listagem, criação e atualização de clients
  export const fetchReservations = (accommodationId, startDate) => async (dispatch) => {
    dispatch({ type: FETCH_RESERVATIONS_REQUEST });
  
    try {
      const reservations = await getReservationsByAccommodation(accommodationId, startDate);
      dispatch({
        type: FETCH_RESERVATIONS_SUCCESS,
        payload: reservations,
      });
    } catch (error) {
      dispatch({
        type: FETCH_RESERVATIONS_FAILURE,
        payload: "Erro ao carregar reservas. Tente novamente mais tarde."
      });
    }
  };
  

  export const createReservationAction = (reservation) => async (dispatch) => {
    try {
      const newReservation = await createReservation(reservation);
      dispatch({
        type: CREATE_RESERVATION_SUCCESS,
        payload: newReservation,
      });
      return newReservation;  
    } catch (error) {
      throw error;  
    }
  };
  
  export const updateReservationAction = (idReservation, reservation) => async (dispatch) => {
    try {
      const updatedReservation = await updateReservation(idReservation, reservation);
      dispatch({
        type: UPDATE_RESERVATION_SUCCESS, 
        payload: updatedReservation,
      });
      return updatedReservation;  
    } catch (error) {
      throw error;  
    }
  };