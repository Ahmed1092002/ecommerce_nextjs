"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { handleHookError } from "./utils/hook-utils";

/**
 * Shared hook for managing async operations with loading and error states
 * This eliminates code duplication across all hooks
 */
export function useAsyncOperation() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Helper function to handle errors
   */
  function handleError(error: unknown): string {
    const errorMessage = handleHookError(error);
    setError(errorMessage);
    toast.error(errorMessage);
    return errorMessage;
  }

  /**
   * Wrapper function for async operations with loading and error handling
   * @param operation - The async operation to execute
   * @param successMessage - Optional success message to display
   * @returns The result of the operation
   */
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

  return {
    loading,
    error,
    withLoadingAndError,
  };
}
