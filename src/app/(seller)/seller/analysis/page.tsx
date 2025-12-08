"use client";
import { useSellerData } from "@/hooks/useSellerData";
import { useEffect, useState } from "react";
import { SellerAnalytics } from "@/types/sellerStat";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalysisPage() {
  const { fetchSellerAnalytics, loading } = useSellerData();
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [dateRange, setDateRange] = useState({
    startDate: thirtyDaysAgo.toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchSellerAnalytics(dateRange).then((data) => setAnalytics(data));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const revenueGrowth = analytics.revenueGrowthPercentage;
  const isPositiveGrowth = revenueGrowth >= 0;

  // Daily Sales Line Chart Data
  const dailySalesData = {
    labels: analytics.dailySales.map((sale) =>
      new Date(sale.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Revenue",
        data: analytics.dailySales.map((sale) => sale.revenue),
        borderColor: "#e76e50",
        backgroundColor: "rgba(231, 110, 80, 0.1)",
        tension: 0.4,
      },
      {
        label: "Orders",
        data: analytics.dailySales.map((sale) => sale.orderCount),
        borderColor: "#2a9d8f",
        backgroundColor: "rgba(42, 157, 143, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Monthly Sales Bar Chart Data
  const monthlySalesData = {
    labels: analytics.monthlySales.map((sale) => sale.month),
    datasets: [
      {
        label: "Revenue",
        data: analytics.monthlySales.map((sale) => sale.revenue),
        backgroundColor: "#e76e50",
      },
      {
        label: "Orders",
        data: analytics.monthlySales.map((sale) => sale.orderCount),
        backgroundColor: "#2a9d8f",
      },
    ],
  };

  // Order Status Doughnut Chart Data
  const orderStatusData = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          analytics.pendingOrders,
          analytics.shippedOrders,
          analytics.deliveredOrders,
          analytics.cancelledOrders,
        ],
        backgroundColor: ["#e8c468", "#2a9d8f", "#e76e50", "#db4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div
      className="space-y-8 p-6 min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Sales Analytics
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Track your business performance and growth metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <label
              className="text-xs mb-1 font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="px-4 py-2 rounded-lg focus:ring-2 transition-all"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-xs mb-1 font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="px-4 py-2 rounded-lg focus:ring-2 transition-all"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 group"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Total Revenue
              </p>
              <p
                className="text-3xl font-bold mt-3"
                style={{ color: "var(--foreground)" }}
              >
                ${analytics.totalRevenue.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {isPositiveGrowth ? (
                  <TrendingUp
                    className="w-4 h-4"
                    style={{ color: "#2a9d8f" }}
                  />
                ) : (
                  <TrendingDown
                    className="w-4 h-4"
                    style={{ color: "var(--primary)" }}
                  />
                )}
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: isPositiveGrowth ? "#2a9d8f" : "var(--primary)",
                  }}
                >
                  {revenueGrowth.toFixed(1)}% from last month
                </p>
              </div>
            </div>
            <div
              className="p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg"
              style={{
                background: "linear-gradient(135deg, #e76e50 0%, #db4444 100%)",
              }}
            >
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 group"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Total Orders
              </p>
              <p
                className="text-3xl font-bold mt-3"
                style={{ color: "var(--foreground)" }}
              >
                {analytics.totalOrders}
              </p>
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#2a9d8f" }}
              >
                {analytics.totalOrdersThisMonth} orders this month
              </p>
            </div>
            <div
              className="p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg"
              style={{
                background: "linear-gradient(135deg, #2a9d8f 0%, #274754 100%)",
              }}
            >
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 group"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Avg Order Value
              </p>
              <p
                className="text-3xl font-bold mt-3"
                style={{ color: "var(--foreground)" }}
              >
                ${analytics.averageOrderValue.toFixed(2)}
              </p>
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#274754" }}
              >
                Per transaction
              </p>
            </div>
            <div
              className="p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg"
              style={{
                background: "linear-gradient(135deg, #274754 0%, #2a9d8f 100%)",
              }}
            >
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300 group"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted-foreground)" }}
              >
                Products Sold
              </p>
              <p
                className="text-3xl font-bold mt-3"
                style={{ color: "var(--foreground)" }}
              >
                {analytics.totalProductsSold}
              </p>
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#e8c468" }}
              >
                of {analytics.totalProducts} listings
              </p>
            </div>
            <div
              className="p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg"
              style={{
                background: "linear-gradient(135deg, #e8c468 0%, #f4a462 100%)",
              }}
            >
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{
                background: "linear-gradient(180deg, #e76e50 0%, #2a9d8f 100%)",
              }}
            ></div>
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Daily Sales Trend
            </h3>
          </div>
          <div className="h-[300px]">
            <Line
              data={dailySalesData}
              options={{ ...chartOptions, maintainAspectRatio: false }}
            />
          </div>
        </Card>

        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{
                background: "linear-gradient(180deg, #e8c468 0%, #db4444 100%)",
              }}
            ></div>
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Order Status Distribution
            </h3>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={orderStatusData}
              options={{ ...doughnutOptions, maintainAspectRatio: false }}
            />
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <Card
          className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{
                background: "linear-gradient(180deg, #2a9d8f 0%, #274754 100%)",
              }}
            ></div>
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Monthly Performance
            </h3>
          </div>
          <div className="h-[350px]">
            <Bar
              data={monthlySalesData}
              options={{ ...chartOptions, maintainAspectRatio: false }}
            />
          </div>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card
        className="p-6 border-none shadow-lg hover:shadow-2xl transition-all duration-300"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, #db4444 0%, #e76e50 100%)",
            }}
          ></div>
          <h3
            className="text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Top Selling Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--muted)",
                }}
              >
                <th
                  className="text-left py-4 px-6 font-bold uppercase text-xs tracking-wider"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Product Name
                </th>
                <th
                  className="text-left py-4 px-6 font-bold uppercase text-xs tracking-wider"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Quantity Sold
                </th>
                <th
                  className="text-left py-4 px-6 font-bold uppercase text-xs tracking-wider"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.topSellingProducts.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td
                    className="py-4 px-6 font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #e76e50 0%, #db4444 100%)",
                        }}
                      >
                        {index + 1}
                      </span>
                      {product.productName}
                    </div>
                  </td>
                  <td
                    className="py-4 px-6 font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {product.quantitySold} units
                  </td>
                  <td
                    className="py-4 px-6 font-bold text-lg"
                    style={{ color: "#2a9d8f" }}
                  >
                    ${product.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
