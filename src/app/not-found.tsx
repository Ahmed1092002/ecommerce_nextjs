"use client";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-2">
      <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
      <p className="text-xl">The page you are looking for does not exist.</p>
      <button
        className="mt-4 text-white bg-(--primary) px-4 py-2 rounded flex items-center gap-2"
        onClick={handleGoBack}
      >
        <Link />
        Go Back
      </button>
    </div>
  );
}
