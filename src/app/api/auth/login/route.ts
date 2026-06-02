import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Demo users for testing
const demoUsers = [
  {
    id: "1",
    email: "admin@ddl.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "System Admin",
    role: "super_admin",
  },
  {
    id: "2",
    email: "supplier@ddl.com",
    password: bcrypt.hashSync("supplier123", 10),
    name: "Jane Supplier",
    role: "supplier",
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = demoUsers.find(u => u.email === email);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    const sessionCookie = btoa(JSON.stringify(sessionData));
    
    const response = NextResponse.json({ user: sessionData });
    response.cookies.set({
      name: "ddl-session",
      value: sessionCookie,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
