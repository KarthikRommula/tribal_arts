import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getUsersCollection, getOrdersCollection } from "@/lib/db-utils"

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

    // Get all users from database
    const usersCollection = await getUsersCollection()
    const users = await usersCollection.find({}).sort({ createdAt: -1 }).toArray()

    // Get orders to calculate order count and total spent per customer
    const ordersCollection = await getOrdersCollection()
    const allOrders = await ordersCollection.find({}).toArray()

    // Map users with their order statistics
    const customersWithStats = users.map(user => {
      const userOrders = allOrders.filter(order => order.userEmail === user.email)
      const orderCount = userOrders.length
      const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0)

      return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name || "N/A",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        createdAt: user.createdAt || new Date().toISOString(),
        orderCount,
        totalSpent: parseFloat(totalSpent.toFixed(2))
      }
    })

    return NextResponse.json({ success: true, data: customersWithStats })
  } catch (error) {
    console.error("Customers API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 })
  }
}
