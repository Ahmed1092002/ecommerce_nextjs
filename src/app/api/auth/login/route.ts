import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Login request body:", body);

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
    res.cookies.set("token", data.data.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    res.cookies.set("role", data.data.userType, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

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
