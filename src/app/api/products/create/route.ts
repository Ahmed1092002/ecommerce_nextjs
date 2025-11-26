import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get("token")?.value;

    const response = await fetch(
      `${BACKEND_URL}/seller/products/CreateProduct`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    const res = NextResponse.json(data);

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to process login request",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
