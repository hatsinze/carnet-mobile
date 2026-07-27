import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../lib/api-client';
import { registerForPushNotifications } from '../lib/notifications';

const STORAGE_KEY = 'expo_push_token';

export async function syncDeviceToken() {
  const result = await registerForPushNotifications();
  if (!result) return;

  try {
    await apiClient.post('/device-tokens', {
      expo_push_token: result.token,
      platform: result.platform,
    });
    await SecureStore.setItemAsync(STORAGE_KEY, result.token);
  } catch (e) {
    console.warn('Failed to register device token:', e);
  }
}

export async function unregisterDeviceToken() {
  const token = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!token) return;

  try {
    await apiClient.delete('/device-tokens', { data: { expo_push_token: token } });
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to unregister device token:', e);
  }
}