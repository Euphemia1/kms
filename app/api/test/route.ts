export const runtime = "nodejs";

import { NextResponse } from "next/server";

// Hardcoded config as fallback
const config = {
  MYSQL_HOST: 'srv1682.hstgr.io',
  MYSQL_PORT: '3306',
  MYSQL_USER: 'u754414236_kms',
  MYSQL_PASSWORD: 'Kmssarl@2025',
  MYSQL_DATABASE: 'u754414236_kms',
  JWT_SECRET: '06cd73b65cc986d84756ba2a56c07eb1d7cc1b7a2fbd295478a60b6e8f3c9d8a',
};

export async function GET() {
  return NextResponse.json({
    message: "Test endpoint working!",
    timestamp: new Date().toISOString(),
    env_check: {
      MYSQL_HOST: config.MYSQL_HOST || "❌ MISSING",
      MYSQL_DATABASE: config.MYSQL_DATABASE || "❌ MISSING",
      MYSQL_USER: config.MYSQL_USER || "❌ MISSING",
      MYSQL_PASSWORD: config.MYSQL_PASSWORD ? "✅ EXISTS" : "❌ MISSING",
      JWT_SECRET: config.JWT_SECRET ? "✅ EXISTS" : "❌ MISSING",
      NODE_ENV: process.env.NODE_ENV || "❌ MISSING"
    }
  });
}