"use client";
import { use, useEffect, useState } from "react";
import { AuthResponse, LoginCredentials, RegisterData } from "./../types/user";
import { api } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [User, setUser] = useState<AuthResponse | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login(loginData: LoginCredentials) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        loginData
      );
      auth.setToken(res.data.token);
      auth.setUser(res.data);
      auth.setRole(res.data.userType);
      setUser(res.data);
      if (res.data.userType === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
      return res.data;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    auth.clearAuth();
    setUser(null);
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
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        registerData
      );
      auth.setToken(res.data.token);
      auth.setUser(res.data);
      auth.setRole(res.data.userType);
      setUser(res.data);
      if (res.data.userType === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
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
    Error,
    login,
    logout,
    loadUser,
    register,
  };
}
