import axios from "axios";
import { obtenerToken } from "./storage";

export const API_URL = "http://192.168.1.64:4000/api";

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});