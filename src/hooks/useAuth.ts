"use client";
import { useEffect, useState } from "react";
import { AuthResponse, LoginCredentials, RegisterData } from "./../types/user";
import { api } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ApiErrorWithField } from "@/lib/api-client";
import { toast } from "react-toastify";

export function useAuth() {
  const [User, setUser] = useState<AuthResponse | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login(loginData: LoginCredentials) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post<AuthResponse>("/auth/login", loginData);
      auth.setToken(res.token);
      auth.setUser(res);
      auth.setRole(res.userType);
      setUser(res);
      toast.success("Login successful!");
      if (res.userType === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
      return res;
    } catch (error) {
      // Extract error message from ApiErrorWithField
      let errorMessage = "An error occurred";
      if (error instanceof ApiErrorWithField) {
        errorMessage = error.message; // This will be the message from API
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      throw error; // Re-throw so form can handle it if needed
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    auth.clearAuth();
    setUser(null);
    toast.info("Logged out successfully");
    router.push("/");
  }

  async function loadUser() {
    const savedUser = auth.getUser();
    const token = auth.getToken();

    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }

  async function register(registerData: RegisterData) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post<AuthResponse>("/auth/register", registerData);
      auth.setToken(res.token);
      auth.setUser(res);
      auth.setRole(res.userType);
      setUser(res);
      if (res.userType === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      // Extract error message from ApiErrorWithField
      let errorMessage = "An error occurred";
      if (error instanceof ApiErrorWithField) {
        errorMessage = error.message; // This will be the message from API
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      throw error; // Re-throw so form can handle it if needed
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return {
    User,
    Loading,
    error,
    login,
    logout,
    loadUser,
    register,
  };
}
