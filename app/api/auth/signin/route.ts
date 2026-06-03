import { type NextRequest, NextResponse } from "next/server"
import { getUserForLogin } from "@/lib/db-utils"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Admin credentials are read from environment variables. Fail closed if they are not configured.
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL and/or ADMIN_PASSWORD environment variables are not set")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    // Check for admin login first
    if (email === adminEmail && password === adminPassword) {
      // Generate JWT token for admin
      const token = jwt.sign(
        { email: adminEmail, role: "admin" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      )

      return NextResponse.json({
        success: true,
        data: {
          _id: "admin",
          email: adminEmail,
          name: "Admin",
          role: "admin"
        },
        token,
        isAdmin: true
      })
    }

    // Regular user authentication
    const user = await getUserForLogin(email)
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Omit password and return user data
    const { password: _, ...userData } = user

    return NextResponse.json({ success: true, data: userData })

  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}