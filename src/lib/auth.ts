import { AuthResponse } from "@/types/user";
import { STORAGE_KEYS } from "./constants";
import Cookies from "js-cookie";

export const auth = {
  // Save token to localStorage
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      Cookies.set(STORAGE_KEYS.TOKEN, token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return Cookies.get(STORAGE_KEYS.TOKEN) || null;
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      Cookies.remove(STORAGE_KEYS.TOKEN);
    }
  },

  // Save user to localStorage
  setUser: (user: AuthResponse): void => {
    if (typeof window !== "undefined") {
      Cookies.set(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  // Get user from localStorage
  getUser: (): AuthResponse | null => {
    if (typeof window !== "undefined") {
      const user = Cookies.get(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Remove user from localStorage
  removeUser: (): void => {
    if (typeof window !== "undefined") {
      Cookies.remove(STORAGE_KEYS.USER);
    }
  },

  // Clear all auth data
  clearAuth: (): void => {
    auth.removeToken();
    auth.removeUser();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};
