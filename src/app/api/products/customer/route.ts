import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080/api";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${BACKEND_URL}/customer/products/GetProducts?${queryString}`
      : `${BACKEND_URL}/customer/products/GetProducts`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching customer products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to fetch customer products",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
