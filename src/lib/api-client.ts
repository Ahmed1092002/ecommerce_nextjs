import { ApiError, ApiResponse } from "@/types/api";
import Cookies from "js-cookie";
import { STORAGE_KEYS } from "./constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Enhanced error class with field information
export class ApiErrorWithField extends Error {
  statusCode: number;
  code: string;
  field?: string; // Add field property

  constructor(
    message: string,
    statusCode: number,
    code: string,
    field?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.name = "ApiErrorWithField";
  }
}

export function createApiError(
  message: string,
  statusCode: number,
  errorCode: string,
  field?: string // Add field parameter
) {
  return new ApiErrorWithField(message, statusCode, errorCode, field);
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string | number | boolean> }
): Promise<T> {
  const token =
    typeof window !== "undefined" ? Cookies.get(STORAGE_KEYS.TOKEN) : null;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      // Pass the error field (e.g., "password") to createApiError
      throw createApiError(
        error.message || "An error occurred",
        error.statusCode || response.status,
        error.error || "Unknown error",
        error.error // The field name from API response
      );
    }

    return data;
  } catch (error) {
    // Re-throw our shaped error
    if (error instanceof ApiErrorWithField) {
      throw error;
    }
    // Handle network errors
    if (error && typeof (error as any).statusCode === "number") {
      throw error;
    }
    throw createApiError("Network error", 500, "NETWORK_ERROR");
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) =>
    apiClient<T>(endpoint, {
      method: "GET",
    }),

  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, {
      method: "DELETE",
    }),
};
