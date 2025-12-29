export const runtime = "nodejs";

import { NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSession, setSessionCookie, signIn as authSignIn } from "@/lib/auth"

async function signIn(email: string, password: string) {
  console.log('=== SIGNIN FUNCTION STARTED ===');
  console.log('Email:', email);

  try {
    console.log('Querying admin_users table...');
    const user = await queryOne<{ id: string; email: string; password_hash: string; role: string }>(
      "SELECT id, email, password_hash, role FROM admin_users WHERE email = ? LIMIT 1",
      [email]
    );
    
    console.log('Query result rows:', user ? 1 : 0);

    if (!user) {
      console.log('No user found with email:', email);
      return { success: false, error: "Invalid email or password" }
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPasswordHash: !!user.password_hash
    });

    console.log('Comparing passwords...');
    const valid = await bcrypt.compare(password, user.password_hash);
    console.log('Password comparison result:', valid);

    if (!valid) {
      console.log('Password mismatch!');
      return { success: false, error: "Invalid email or password" }
    }

    console.log('Creating database session...');
    const sessionToken = await createSession(user.id);
    console.log('Database session created successfully');

    return { success: true, token: sessionToken, user: { id: user.id, email: user.email, role: user.role } }
  } catch (err: any) {
    console.error('=== SIGNIN ERROR ===');
    console.error('Error message:', err.message);
    return { success: false, error: "Internal server error: " + err.message }
  }
}

export async function POST(request: Request) {
  console.log('=== LOGIN API CALLED ===');
  
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const result = await signIn(email, password);
    console.log('signIn result:', { success: result.success, hasToken: !!result.token });

    if (!result.success) {
      console.log('Login failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    console.log('Login successful, setting cookie...');

    // The signIn function already sets the session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful'
    });

    console.log('=== LOGIN COMPLETED SUCCESSFULLY ===');
    console.log('Cookie set with token');
    return response;
    
  } catch (error: any) {
    console.error('=== LOGIN API ERROR ===');
    console.error('Error:', error.message);
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}

