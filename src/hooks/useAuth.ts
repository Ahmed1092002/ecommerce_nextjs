"use client";
import { useEffect, useState } from "react";
import {
  AuthResponse,
  CreateCustomerProfile,
  CreateSellerProfile,
  LoginCredentials,
  RegisterData,
  SellerProfile,
  CustomerProfile,
} from "./../types/user";
import { api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ApiErrorWithField } from "@/lib/api-client";
import { toast } from "react-toastify";

// Better type for user state - only profile response types
type UserState = SellerProfile | CustomerProfile | AuthResponse | null;

export function useAuth() {
  const [user, setUser] = useState<UserState>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to extract and handle errors
  function handleError(error: unknown): string {
    let errorMessage = "An error occurred";
    if (error instanceof ApiErrorWithField) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    setError(errorMessage);
    toast.error(errorMessage);
    return errorMessage;
  }

  // Wrapper function for async operations with loading and error handling
  async function withLoadingAndError<T>(
    operation: () => Promise<T>,
    successMessage?: string
  ): Promise<T> {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function login(loginData: LoginCredentials) {
    return withLoadingAndError(async () => {
      const res = await api.post<AuthResponse>("/auth/login", loginData);
      auth.setToken(res.token);
      auth.setUser(res);
      auth.setRole(res.userType);
      setUser(res);
      if (res.userType === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
      return res;
    }, "Login successful!");
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

  async function createSellerProfile(profileData: CreateSellerProfile) {
    return withLoadingAndError(async () => {
      const res = await api.post<AuthResponse>("/seller/profile", profileData);
      auth.setUser(res);
      setUser(res);
      router.push("/seller/dashboard");
      return res;
    }, "Seller profile created successfully!");
  }

  async function createCustomerProfile(profileData: CreateCustomerProfile) {
    return withLoadingAndError(async () => {
      const res = await api.post<AuthResponse>(
        "/customer/profile",
        profileData
      );
      auth.setUser(res);
      setUser(res);
      router.push("/");
      return res;
    }, "Customer profile created successfully!");
  }

  async function getSellerProfile() {
    return withLoadingAndError(async () => {
      const res = await api.get<SellerProfile>("/seller/profile");
      setUser(res);
      return res;
    }, "Profile loaded successfully!");
  }

  async function getCustomerProfile() {
    return withLoadingAndError(async () => {
      const res = await api.get<CustomerProfile>("/customer/profile");
      setUser(res);
      return res;
    }, "Profile loaded successfully!");
  }

  async function updateSellerProfile(profileData: CreateSellerProfile) {
    return withLoadingAndError(async () => {
      const res = await api.put<SellerProfile>("/seller/profile", profileData);
      setUser(res);
      return res;
    }, "Profile updated successfully!");
  }

  async function updateCustomerProfile(profileData: CreateCustomerProfile) {
    return withLoadingAndError(async () => {
      const res = await api.put<CustomerProfile>(
        "/customer/profile",
        profileData
      );
      setUser(res);
      return res;
    }, "Profile updated successfully!");
  }

  async function register(registerData: RegisterData) {
    return withLoadingAndError(async () => {
      const res = await api.post<AuthResponse>("/auth/register", registerData);
      auth.setToken(res.token);
      auth.setUser(res);
      auth.setRole(res.userType);
      setUser(res);
      if (res.userType === "SELLER") {
        router.push("/createProfile/sellerPage");
      } else {
        router.push("/createProfile/customerProfile");
      }
      return res;
    }, "Registration successful!");
  }

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    loadUser,
    register,
    getSellerProfile,
    getCustomerProfile,
    updateSellerProfile,
    updateCustomerProfile,
    createSellerProfile,
    createCustomerProfile,
  };
}
