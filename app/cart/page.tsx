"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import RouteProtection from "@/components/route-protection"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  const subtotal = total
  const shipping = items.length > 0 ? 10 : 0
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax

  return (
    <RouteProtection requireUser={true}>
      <>
        <Header />
        <main className="min-h-screen">
          <div className="bg-secondary/10 py-8">
            <div className="max-w-7xl mx-auto px-3">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
            </div>
          </div>

        <div className="max-w-7xl mx-auto px-3 py-12">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-card p-6 rounded-lg border border-border">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-lg font-bold text-primary mt-2">₹{item.price.toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-destructive hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="text-right mt-4">
                          <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/products">
                  <Button variant="outline" className="mt-6 gap-2 bg-transparent">
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-3">Proceed to Checkout</Button>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    Clear Cart
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-4">Free shipping on orders over ₹5000</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
    </RouteProtection>
  )
}
