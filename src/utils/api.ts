import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface ApiErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: string | string[] | undefined;
}

const API_BASE = "https://korddyfirebase.imlinkey.store/api/v1/";

// Função para pegar cookie
const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar Authorization com token
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export default api;