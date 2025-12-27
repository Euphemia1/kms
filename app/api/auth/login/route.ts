// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT || 3306),
}

// Sign in function with detailed logging
async function signIn(email: string, password: string) {
  console.log('🔍 === SIGNIN FUNCTION STARTED ===');
  console.log('📧 Email:', email);
  console.log('🔌 DB Config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    passwordExists: !!dbConfig.password
  });

  let connection;
  try {
    console.log('🔌 Attempting database connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');

    console.log('🔍 Querying admin_users table...');
    const [rows]: any = await connection.execute(
      "SELECT * FROM admin_users WHERE email = ? LIMIT 1",
      [email]
    );
    console.log('📊 Query result rows:', rows.length);

    if (!rows.length) {
      console.log('❌ No user found with email:', email);
      return { success: false, error: "Invalid email or password" }
    }

    const user = rows[0];
    console.log('👤 User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPasswordHash: !!user.password_hash,
      passwordHashPrefix: user.password_hash?.substring(0, 10)
    });

    console.log('🔐 Comparing passwords...');
    console.log('   Input password length:', password.length);
    console.log('   Stored hash prefix:', user.password_hash?.substring(0, 10));
    
    const valid = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password comparison result:', valid);

    if (!valid) {
      console.log('❌ Password mismatch!');
      return { success: false, error: "Invalid email or password" }
    }

    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is missing!');
      return { success: false, error: "Server misconfiguration: JWT secret missing" }
    }

    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log('✅ JWT token generated successfully');

    return { success: true, token }
  } catch (err: any) {
    console.error('❌ === SIGNIN ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
    return { success: false, error: "Internal server error: " + err.message }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// POST handler
export async function POST(request: Request) {
  console.log('🚀 === LOGIN API CALLED ===');
  
  try {
    const { email, password } = await request.json();
    console.log('📧 Login attempt for email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const result = await signIn(email, password);
    console.log('📊 signIn result:', result);

    if (!result.success) {
      console.log('❌ Login failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    console.log('✅ Login successful, setting cookie...');
    const cookie = `token=${result.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60}`;
    const res = NextResponse.json({ success: true });
    res.headers.set("Set-Cookie", cookie);

    console.log('🎉 === LOGIN COMPLETED SUCCESSFULLY ===');
    return res;
  } catch (error: any) {
    console.error('❌ === LOGIN API ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}