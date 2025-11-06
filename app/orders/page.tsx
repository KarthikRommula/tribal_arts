"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"

interface Order {
  orderId: string
  items: any[]
  total: number
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  createdAt: string
  status: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-secondary/10 py-8">
          <div className="max-w-7xl mx-auto px-3">
            <h1 className="text-3xl font-bold">My Orders</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 py-12">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">You haven't placed any orders yet. Start shopping now!</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">Shop Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.orderId} className="bg-card border border-border rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                      <p className="text-xl font-bold">#{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="text-xl font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Items</p>
                      <p className="font-semibold">{order.items.length} item(s)</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 mb-6">
                    <h3 className="font-semibold mb-4">Items Ordered</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.name}
                      <br />
                      {order.customer.address}
                      <br />
                      {order.customer.email}
                      <br />
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/products"
            className="flex items-center gap-2 text-primary mt-12 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
