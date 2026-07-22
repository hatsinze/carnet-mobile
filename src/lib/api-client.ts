import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE = 'http://192.168.14.38:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  }
);

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync('auth_token', token);
}
export async function clearAuthToken() {
  await SecureStore.deleteItemAsync('auth_token');
}