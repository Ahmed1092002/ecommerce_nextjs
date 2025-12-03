import { AuthResponse } from "@/types/user";
import { STORAGE_KEYS } from "./constants";
import Cookies from "js-cookie";

export const auth = {
  // ⚠️ Token is now stored in httpOnly cookies by API routes
  // We no longer store it client-side for security

  // Get token from httpOnly cookie (for checking if authenticated)
  // Note: We can't actually read the token value, but we can check if it exists
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      // We can read the 'role' cookie to infer if user is authenticated
      // The actual token is in httpOnly cookie (not accessible to JS)
      return Cookies.get(STORAGE_KEYS.ROLE) ? "exists" : null;
    }
    return null;
  },

  // Role management (non-sensitive, can be client-side)
  setRole: (role: string): void => {
    if (typeof window !== "undefined") {
      Cookies.set(STORAGE_KEYS.ROLE, role);
    }
  },

  getRole: (): string | null => {
    if (typeof window !== "undefined") {
      return Cookies.get(STORAGE_KEYS.ROLE) || null;
    }
    return null;
  },

  removeRole: (): void => {
    if (typeof window !== "undefined") {
      Cookies.remove(STORAGE_KEYS.ROLE);
    }
  },

  // User data management (store WITHOUT token for security)
  setUser: (user: AuthResponse): void => {
    if (typeof window !== "undefined") {
      // Create a copy without the token
      const { token: _token, ...userWithoutToken } = user;
      Cookies.set(STORAGE_KEYS.USER, JSON.stringify(userWithoutToken));
    }
  },

  getUser: (): Omit<AuthResponse, "token"> | null => {
    if (typeof window !== "undefined") {
      const user = Cookies.get(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  removeUser: (): void => {
    if (typeof window !== "undefined") {
      Cookies.remove(STORAGE_KEYS.USER);
    }
  },

  // Clear all auth data (client-side only - httpOnly cookies cleared by API)
  clearAuth: (): void => {
    auth.removeUser();
    auth.removeRole();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    // Check if role cookie exists (indicates httpOnly token cookie also exists)
    return !!auth.getRole();
  },
};
