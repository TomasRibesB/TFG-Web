import axios from "axios";
import { StorageAdapter } from "../adapters/storage-adapter";
import { User } from "../../infrastructure/interfaces/user";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
    async (config) => {

        const user = await StorageAdapter.getItem<Partial<User>>('user');
        if (user && user.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }

        return config;
    });

export {
    api
}