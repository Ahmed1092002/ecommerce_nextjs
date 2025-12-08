"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { handleHookError } from "./utils/hook-utils";

export interface UseUploadImageReturn {
  loading: boolean;
  error: string | null;
  imageFile: File | null;
  displayUrl: string | null;
  getImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: (file: File) => Promise<string>;
  clearImage: () => void;
}

export default function useUploadImage(): UseUploadImageReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  // Helper function to handle errors
  function handleError(error: unknown): string {
    const errorMessage = handleHookError(error);
    setError(errorMessage);
    toast.error(errorMessage);
    return errorMessage;
  }

  function getImageFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const tempUrl = URL.createObjectURL(file);

      // Clean up the old URL to free memory
      if (displayUrl) {
        URL.revokeObjectURL(displayUrl);
      }

      setDisplayUrl(tempUrl);
    }
  }

  async function uploadImage(file: File): Promise<string> {
    try {
      setLoading(true);
      setError(null);

      const sanitizedFileName = file.name
        .replace(/[^a-zA-Z0-9.\-]/g, "_")
        .toLowerCase();
      const filePath = `images/${Date.now()}-${sanitizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }

      toast.success("Image uploaded successfully!");
      return urlData.publicUrl;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearImage(): void {
    if (displayUrl) {
      URL.revokeObjectURL(displayUrl);
    }
    setImageFile(null);
    setDisplayUrl(null);
    setError(null);
  }

  return {
    loading,
    error,
    imageFile,
    displayUrl,
    getImageFile,
    uploadImage,
    clearImage,
  };
}
