export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Test endpoint working!",
    timestamp: new Date().toISOString(),
    env_check: {
      MYSQL_HOST: process.env.MYSQL_HOST || "❌ MISSING",
      MYSQL_DATABASE: process.env.MYSQL_DATABASE || "❌ MISSING",
      MYSQL_USER: process.env.MYSQL_USER || "❌ MISSING",
      MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? "✅ EXISTS" : "❌ MISSING",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ EXISTS" : "❌ MISSING",
      NODE_ENV: process.env.NODE_ENV || "❌ MISSING"
    }
  });
}