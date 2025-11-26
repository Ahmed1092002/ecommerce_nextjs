import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">🛒 Store</h3>
            <p className="text-slate-400 text-sm">
              Your trusted e-commerce platform
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-orange-400 transition-colors cursor-pointer">
                About Us
              </li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">
                Contact
              </li>
              <li className="hover:text-orange-400 transition-colors cursor-pointer">
                Support
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 hover:bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                f
              </div>
              <div className="w-8 h-8 bg-blue-600 hover:bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                t
              </div>
              <div className="w-8 h-8 bg-blue-600 hover:bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
                in
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-slate-500 border-t border-slate-700 pt-6">
          © {new Date().getFullYear()} Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
