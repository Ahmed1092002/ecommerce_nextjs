import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080/api";

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies for authentication
    const token = request.cookies.get("token")?.value;

    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${BACKEND_URL}/seller/products/GetProducts?${queryString}`
      : `${BACKEND_URL}/seller/products/GetProducts`;

    const response = await fetch(endpoint, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to fetch seller products",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
