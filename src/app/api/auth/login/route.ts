import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    const res = NextResponse.json(data);
    res.cookies.set("token", data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    res.cookies.set("role", data.userType, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login API route error:", error);
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
