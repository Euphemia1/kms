export const runtime = "nodejs";

import { NextResponse } from "next/server";

const envConfig = require('../../../env.config.js');

export async function GET() {
  return NextResponse.json({
    message: "Test endpoint working!",
    timestamp: new Date().toISOString(),
    env_check: {
      MYSQL_HOST: envConfig.MYSQL_HOST || "❌ MISSING",
      MYSQL_DATABASE: envConfig.MYSQL_DATABASE || "❌ MISSING",
      MYSQL_USER: envConfig.MYSQL_USER || "❌ MISSING",
      MYSQL_PASSWORD: envConfig.MYSQL_PASSWORD ? "✅ EXISTS" : "❌ MISSING",
      JWT_SECRET: envConfig.JWT_SECRET ? "✅ EXISTS" : "❌ MISSING",
      NODE_ENV: envConfig.NODE_ENV || "❌ MISSING"
    }
  });
}