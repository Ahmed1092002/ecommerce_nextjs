"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, Mail, Edit2, BarChart3 } from "lucide-react";
import { SellerProfile as SellerProfileType } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";

export default function SellerProfile() {
  const { user, getSellerProfile, updateSellerProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
  });

  useEffect(() => {
    getSellerProfile();
  }, []);

  useEffect(() => {
    if (user && "businessName" in user) {
      setFormData({ businessName: user.businessName });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateSellerProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (user && "businessName" in user) {
      setFormData({ businessName: user.businessName });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  const sellerUser = user as SellerProfileType | null;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-32 bg-[var(--primary)]"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              {/* Business Logo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white">
                  <Store className="w-12 h-12 text-[var(--primary)]" />
                </div>
              </div>

              {/* Business Name and Email */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {sellerUser?.businessName || "Business Name"}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {sellerUser?.email}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active Seller
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Verified
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[var(--primary)] hover:bg-slate-800 transition-colors text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Business Information Card */}
        <Card className="p-6 border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[var(--primary)]" />
              Business Information
            </h2>
            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[var(--primary)] hover:bg-slate-800 transition-colors text-white"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Store className="w-4 h-4 text-[var(--primary)]" />
                Business Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="focus:ring-slate-900 focus:border-slate-900"
                  placeholder="Enter your business name"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                  {sellerUser?.businessName || "Not provided"}
                </p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--primary)]" />
                Business Email
              </label>
              <p className="text-gray-900 text-lg font-medium py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                {sellerUser?.email}
              </p>
              <p className="text-xs text-gray-500">
                Email cannot be changed for security reasons
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
