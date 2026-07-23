import {
  AxiosError,
  AxiosHeaders,
  create,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE) {
  throw new Error("EXPO_PUBLIC_API_URL is not set — check your .env file.");
}

export const apiClient = create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// Registered by AuthProvider so the interceptor (outside the React tree)
// can trigger a logout + redirect without importing React state directly.
let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync("auth_token");

    if (token) {
      config.headers = AxiosHeaders.from(config.headers || {});
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("auth_token");
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync("auth_token", token);
}
export async function clearAuthToken() {
  await SecureStore.deleteItemAsync("auth_token");
}
