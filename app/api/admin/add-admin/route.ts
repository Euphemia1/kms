import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, execute } from "@/lib/db";

const MAX_ADMINS = 5;

export async function POST(request: Request) {
  try {
    const { full_name, email, password } = await request.json();

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existingAdmins = await query<{ count: number }>("SELECT COUNT(*) as count FROM admin_users");
    if (existingAdmins[0].count >= MAX_ADMINS) {
      return NextResponse.json({ error: "Maximum number of admins reached." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await execute(
      "INSERT INTO admin_users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, "admin"]
    );

    return NextResponse.json({ success: true, message: "Admin added successfully." });
  } catch (error: any) {
    console.error("Error adding admin:", error);
    return NextResponse.json({ error: "Failed to add admin." }, { status: 500 });
  }
}