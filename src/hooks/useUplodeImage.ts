"use client";
import { supabase } from "@/lib/supabaseClient";
import React from "react";
export default function useUplodeImage() {
  const [imageUrl, setImageUrl] = React.useState<File>(null);
  const [displayUrl, setDisplayUrl] = React.useState<string | null>(null);
  function getImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setImageUrl(file);
      const tempUrl = URL.createObjectURL(file);
      setDisplayUrl(tempUrl);

      // Optional: Clean up the old URL to free memory (best practice)
      if (displayUrl) {
        URL.revokeObjectURL(displayUrl);
      }
    }
  }
  const uploadImage = async (file: File) => {
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.\-]/g, "_") // Replace spaces, parens, etc. with underscore
      .toLowerCase();
    const filePath = `images/${Date.now()}-${sanitizedFileName}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    if (error) console.log(error);
    else console.log(urlData?.publicUrl);
    return urlData?.publicUrl;
  };
  return { uploadImage, imageUrl, displayUrl, getImageFile };
}
