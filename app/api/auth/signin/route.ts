import { type NextRequest, NextResponse } from "next/server"
import { getUserForLogin } from "@/lib/db-utils"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Admin credentials - in production, store in database
const ADMIN_EMAIL = "admin@tribalarts.com"
const ADMIN_PASSWORD = "admin123"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Check for admin login first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate JWT token for admin
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: "admin" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      )

      return NextResponse.json({
        success: true,
        data: {
          _id: "admin",
          email: ADMIN_EMAIL,
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