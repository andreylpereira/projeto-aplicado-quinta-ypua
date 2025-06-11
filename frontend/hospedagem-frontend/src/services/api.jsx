import axios from "axios";
import { jwtDecode } from "jwt-decode";

//Criação inicial do axios, de interceptos para colocar o autherization nas requisições para os pontos de api, como também para acessar informações como id e usuário do token.
const api = axios.create({
  baseURL: "https://hospedagem-api.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  }
  return null;
};

export const getUserAccessFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.perfil.authority;
  }
  return null;
};

export default api;
