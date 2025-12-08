export interface SellerStat {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
export interface dailySales {
  date: string;
  revenue: number;
  orderCount: number;
}
export interface monthlySales {
  month: string;
  revenue: number;
  orderCount: number;
}
export interface topSellingProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}
export interface SellerAnalytics {
  totalRevenue: number;
  totalRevenueThisMonth: number;
  totalRevenueLastMonth: number;
  revenueGrowthPercentage: number;
  totalOrders: number;
  totalOrdersThisMonth: number;
  totalOrdersLastMonth: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  totalProductsSold: number;
  averageOrderValue: number;
  dailySales: dailySales[];
  monthlySales: monthlySales[];
  topSellingProducts: topSellingProduct[];
}
