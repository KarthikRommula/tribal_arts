import { type NextRequest, NextResponse } from "next/server"
import { getCartByUserId, updateCart, clearCart } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID parameter is required" }, { status: 400 })
    }

    const cart = await getCartByUserId(userId)
    return NextResponse.json({ success: true, data: cart?.items || [] })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const result = await updateCart(userId, items)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID parameter is required" }, { status: 400 })
    }

    const result = await clearCart(userId)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ success: false, error: "Failed to clear cart" }, { status: 500 })
  }
}