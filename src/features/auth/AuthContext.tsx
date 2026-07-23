import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, setAuthToken, clearAuthToken } from '../../lib/api-client';
import type { AuthUser } from '../../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await apiClient.get<AuthUser>('/me');
        //console.log(res);
        setUser(res.data);
      } catch {
        await clearAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const response = await apiClient.post<{ token: string; user: AuthUser }>('/login', { email, password });
    await setAuthToken(response.data.token);
    setUser(response.data.user);
  }

  async function logout() {
    try { await apiClient.post('/logout'); } catch {}
    await clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}