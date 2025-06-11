import isEqual from "lodash.isequal";

import {
  FETCH_ACCOMMODATIONS_REQUEST,
  FETCH_ACCOMMODATIONS_SUCCESS,
  FETCH_ACCOMMODATIONS_FAILURE,
  CREATE_ACCOMMODATION_SUCCESS,
  UPDATE_ACCOMMODATION_SUCCESS,
} from "../types/actionTypes.jsx";

import {
  getAccommodations,
  createAccommodation,
  updateAccommodation,
} from "../../services/accommodationService.jsx";

//Actions de listagem, criação e atualização de accommodations
export const fetchAccommodations = () => async (dispatch, getState) => {
  try {
    const currentAccommodations = getState().accommodations.accommodations;
    const newAccommodationsRaw = await getAccommodations();

    const normalize = (accommodations) =>
      accommodations.map((a) => ({
        id: a.id,
        nome: a.nome,
        descricao: a.descricao,
        capacidade: a.capacidade,
        preco: a.preco,
        habilitado: a.habilitado,
        amenidades: a.amenidades?.map((am) => am.nome).sort(),
      }));

    const currentNormalized = normalize(currentAccommodations);
    const newNormalized = normalize(newAccommodationsRaw);

    if (!isEqual(currentNormalized, newNormalized)) {
      dispatch({ type: FETCH_ACCOMMODATIONS_REQUEST });

      dispatch({
        type: FETCH_ACCOMMODATIONS_SUCCESS,
        payload: newAccommodationsRaw,
      });
    } else {
      dispatch({
        type: FETCH_ACCOMMODATIONS_SUCCESS,
        payload: currentAccommodations,
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_ACCOMMODATIONS_FAILURE,
      payload: "Erro ao carregar as acomodações. Tente novamente mais tarde.",
    });
  }
};



export const createAccommodationAction =
  (accommodation) => async (dispatch) => {
    try {
      const newAccommodation = await createAccommodation(accommodation);
      dispatch({
        type: CREATE_ACCOMMODATION_SUCCESS,
        payload: newAccommodation,
      });
      return newAccommodation;
    } catch (error) {
      throw error;
    }
  };

export const updateAccommodationAction =
  (idAccommodation, accommodation) => async (dispatch) => {
    try {
      const updatedAccommodation = await updateAccommodation(
        idAccommodation,
        accommodation
      );
      dispatch({
        type: UPDATE_ACCOMMODATION_SUCCESS,
        payload: updatedAccommodation,
      });
      return updatedAccommodation;
    } catch (error) {
      throw error;
    }
  };
