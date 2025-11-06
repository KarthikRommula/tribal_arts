import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOrdersCollection } from "@/lib/db-utils"

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

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get all orders for admin
    const ordersCollection = await getOrdersCollection()
    const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}