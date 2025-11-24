import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Store. All rights reserved.
      </div>
    </footer>
  );
}
