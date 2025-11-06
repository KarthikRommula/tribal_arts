import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createProduct } from "@/lib/db-utils"

// Middleware to verify admin token
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (decoded.role === "admin") {
      return decoded
    }
    return null
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required" },
        { status: 400 }
      )
    }

    const result = await createProduct(productData)

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: result },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
