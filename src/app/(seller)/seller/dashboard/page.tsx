"use client";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  TrendingUp,
  BarChart3,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useSellerData } from "@/hooks/useSellerData";
import { useEffect, useState } from "react";
import { SellerStat } from "@/types/sellerStat";

export default function SellerPage() {
  const { user } = useAuth();
  const { fetchSellerStats } = useSellerData();
  const [stats, setStats] = useState<SellerStat | null>(null);

  useEffect(() => {
    if (user) {
      fetchSellerStats().then((data) => setStats(data));
    }
  }, [user, fetchSellerStats]);

  return (
    <div>
      {/* Business Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 border-none shadow-md hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stats?.totalRevenue.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />+
                {stats
                  ? (
                      (stats.totalRevenue / (stats.totalRevenue || 1)) *
                      100
                    ).toFixed(1)
                  : "0"}
                % from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-md hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalProducts || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active listings</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-md hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalOrders || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-none shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-[var(--primary)] hover:opacity-90 h-auto py-4 flex-col gap-2 text-white">
            <Package className="w-6 h-6" />
            <span>Add New Product</span>
          </Button>
          <Button
            variant="outline"
            className="border-slate-300 h-auto py-4 flex-col gap-2 hover:bg-slate-50"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>View Orders</span>
          </Button>
          <Button
            variant="outline"
            className="border-slate-300 h-auto py-4 flex-col gap-2 hover:bg-slate-50"
          >
            <BarChart3 className="w-6 h-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
