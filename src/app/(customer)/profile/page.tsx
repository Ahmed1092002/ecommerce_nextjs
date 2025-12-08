"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  ShoppingBag,
  Heart,
  MapPin,
} from "lucide-react";
import { CustomerProfile as CustomerProfileType } from "@/types/user";
import { useRouter } from "next/navigation";

export default function CustomerProfile() {
  const router = useRouter();
  const { user, getCustomerProfile, updateCustomerProfile, loading } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    getCustomerProfile();
  }, []);

  useEffect(() => {
    if (user && "name" in user) {
      setFormData({ name: user.name });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateCustomerProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (user && "name" in user) {
      setFormData({ name: user.name });
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

  const customerUser = user as CustomerProfileType | null;

  return (
    <div className="min-h-screen  from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-32 bg-[var(--primary)]"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white">
                  <User className="w-16 h-16 text-[var(--primary)]" />
                </div>
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Name and Email */}
              <div className="flex-1 mt-4 sm:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  {customerUser?.name || "Customer"}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {customerUser?.email}
                </p>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[var(--primary)] hover:opacity-90 transition-opacity text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Information Card */}
        <Card className="p-6 border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Profile Information
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
                  className="bg-[var(--primary)] hover:opacity-90 text-white"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--primary)]" />
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium py-2 px-3 bg-gray-50 rounded-md">
                  {customerUser?.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--primary)]" />
                Email Address
              </label>
              <p className="text-gray-900 text-lg font-medium py-2 px-3 bg-gray-50 rounded-md">
                {customerUser?.email}
              </p>
              <p className="text-xs text-gray-500">
                Email cannot be changed for security reasons
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="p-6 border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/profile/orders")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/profile/wishlist")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wishlist Items</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/profile/addresses")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Addresses</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
