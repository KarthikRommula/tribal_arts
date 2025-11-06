import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
            <div className="space-y-4 mb-8">
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Standard Shipping</h3>
                <p className="text-muted-foreground mb-2">5-7 business days</p>
                <p className="text-sm text-muted-foreground">Free on orders over ₹2000</p>
              </div>
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Express Shipping</h3>
                <p className="text-muted-foreground mb-2">2-3 business days</p>
                <p className="text-sm text-muted-foreground">₹250</p>
              </div>
              <div className="border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Overnight Shipping</h3>
                <p className="text-muted-foreground mb-2">1 business day</p>
                <p className="text-sm text-muted-foreground">₹500</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Shipping Policies</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
              <li>All orders are processed within 1-2 business days</li>
              <li>Shipping costs are calculated at checkout</li>
              <li>International shipping available to select countries</li>
              <li>Tracking information provided via email</li>
              <li>Signature required for orders over ₹10000</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p className="text-muted-foreground mb-4">
              We ship to most countries worldwide. International shipping rates and delivery times vary by location.
              Customs fees and import duties may apply and are the responsibility of the recipient.
            </p>
            <p className="text-muted-foreground">
              For international orders, please allow additional time for customs clearance.
              We are not responsible for delays caused by customs processing.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}