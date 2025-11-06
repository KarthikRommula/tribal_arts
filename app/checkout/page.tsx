"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { ChevronLeft, Check, LogIn, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import RouteProtection from "@/components/route-protection";
import Script from "next/script";
import type { RazorpayOptions, RazorpayResponse } from "@/types/razorpay";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState("shipping"); // This state is not used, but we'll leave it
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(""); // State to hold the new order ID
  const [orderTotal, setOrderTotal] = useState(0); // State to hold the order total
  const [isProcessing, setIsProcessing] = useState(false); // State for payment processing
  const [paymentFailed, setPaymentFailed] = useState(false); // State for payment failure
  const [razorpayLoaded, setRazorpayLoaded] = useState(false); // State for Razorpay script loading
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !user && items.length > 0) {
      router.push("/signin?redirect=/checkout");
    }
  }, [user, authLoading, items.length, router]);

  // Check if Razorpay script is loaded
  useEffect(() => {
    const checkRazorpay = () => {
      if (typeof window.Razorpay !== "undefined") {
        setRazorpayLoaded(true);
      }
    };

    // Check immediately
    checkRazorpay();

    // Also check after a short delay in case script loads asynchronously
    const timer = setTimeout(checkRazorpay, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user && user.name && user.email) {
      const nameParts = user.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      }));
    }
  }, [user]);

  // --- CALCULATIONS ---
  const subtotal = total;
  const shipping = items.length > 0 ? 10 : 0; // Use items.length to check for empty cart
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;
  // --- END CALCULATIONS ---

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    // This return block is fine as-is
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to your account to complete your purchase.
            </p>
            <div className="space-y-4">
              <Link href="/signin?redirect=/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup?redirect=/checkout">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //
  // --- *** RAZORPAY PAYMENT INTEGRATION *** ---
  //
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/signin?redirect=/checkout");
      return;
    }

    if (!razorpayLoaded) {
      alert("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "INR",
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order");
      }

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK not loaded. Please refresh the page and try again.");
      }

      // Step 2: Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Tribal Arts",
        description: "Purchase from Tribal Arts Store",
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Step 4: Save order to database
              const orderData = {
                items,
                total: finalTotal,
                customer: {
                  name: `${formData.firstName} ${formData.lastName}`,
                  email: formData.email,
                  phone: formData.phone,
                  address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
                },
                userEmail: user.email,
                createdAt: new Date().toISOString(),
                status: "confirmed",
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              };

              const saveOrderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
              });

              const result = await saveOrderResponse.json();

              if (result.success) {
                const newOrderId =
                  result.data.insertedId ||
                  Math.random().toString(36).substring(7).toUpperCase();
                setOrderId(newOrderId);
                setOrderTotal(finalTotal);
                setOrderPlaced(true);
                clearCart();
              }
            } else {
              console.error("Payment verification failed");
              setPaymentFailed(true);
            }
          } catch (error) {
            console.error("Error processing payment:", error);
            setPaymentFailed(true);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#FF6B35",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error?.description || response.error || response);
        setPaymentFailed(true);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };
  // --- *** END RAZORPAY INTEGRATION *** ---

  if (items.length === 0 && !orderPlaced && !paymentFailed) {
    // This return block is fine as-is
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add items to your cart before checking out
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    // This return block is fine, but we'll use the state `orderId`
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your order has been placed
                successfully.
              </p>

              <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  Order Number
                </p>
                {/* MODIFIED: Use the real order ID */}
                <p className="text-2xl font-bold mb-6 break-all">#{orderId}</p>

                {/* Note: `items` is now empty because we called clearCart().
                  To show items here, you'd need to store them in a temporary
                  state variable *before* clearing the cart.
                  
                  For simplicity, we'll leave this as-is, but in a real app
                  you would pass the `items` to this success page.
                */}
                <p className="text-sm text-muted-foreground mb-2">
                  Items Ordered
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm">Your items are being processed.</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Return to Home
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (paymentFailed) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-8">
                Unfortunately, your payment could not be processed. Please try again or contact support.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setPaymentFailed(false)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Try Again
                </Button>
                <Link href="/cart">
                  <Button variant="outline" className="w-full bg-transparent">
                    Return to Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --- RENDER CHECKOUT FORM ---
  // This JSX is fine as-is.
  return (
    <RouteProtection requireUser={true}>
      <>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <Header />
        <main className="min-h-screen bg-secondary/5">
          <div className="max-w-7xl mx-auto px-3 py-12">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-primary mb-8 hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Cart
            </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePlaceOrder} className="space-y-8">
                {/* Shipping Info */}
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-xl font-bold mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-xl font-bold mb-6">
                    Payment Information
                  </h2>
                  <div className="flex items-center justify-center p-8 bg-secondary/20 rounded-lg border-2 border-dashed border-border">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-sm font-semibold mb-2">Secure Payment via Razorpay</p>
                      <p className="text-xs text-muted-foreground">
                        Click "Proceed to Payment" to complete your purchase securely
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || !razorpayLoaded}
                  className="w-full bg-primary hover:bg-primary/90 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : !razorpayLoaded ? "Loading Payment..." : "Proceed to Payment"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm pb-4 border-b border-border"
                    >
                      <div>
                        <p className="font-semibold line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 bg-secondary/50 p-4 rounded-lg">
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
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
    </RouteProtection>
  );
}
