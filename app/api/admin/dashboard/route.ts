import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOrdersByEmail, getUsersCollection, getContactMessages } from "@/lib/db-utils"

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

    // Get dashboard statistics
    const users = await getUsersCollection()
    const totalCustomers = await users.countDocuments()

    // Get all orders (admin can see all orders)
    const ordersCollection = await import("@/lib/mongodb").then(m => m.getOrdersCollection())
    const allOrders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray()

    const totalOrders = allOrders.length
    const totalRevenue = allOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.total || 0), 0)

    // Get recent orders (last 10)
    const recentOrders = allOrders.slice(0, 10)

    // Get contact messages
    const contactMessages = await getContactMessages()
    const pendingMessages = contactMessages.filter(msg => msg.status === "unread").length

    // Get recent messages (last 10)
    const recentMessages = contactMessages.slice(0, 10)

    return NextResponse.json({
      success: true,
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingMessages,
      recentOrders,
      recentMessages,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}