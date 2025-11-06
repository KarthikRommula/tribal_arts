import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              We want you to be completely satisfied with your purchase. If you're not happy with your order,
              we're here to help.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
              <li>30-day return window from delivery date</li>
              <li>Items must be unused and in original packaging</li>
              <li>Return shipping costs are covered for defective items</li>
              <li>Customer pays return shipping for change of mind returns</li>
              <li>Custom or personalized items are not eligible for return</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-8">
              <li>Contact our customer service team at returns@tribalarts.com</li>
              <li>Include your order number and reason for return</li>
              <li>Receive a return authorization number</li>
              <li>Package the item securely in its original packaging</li>
              <li>Ship to the address provided in your return authorization</li>
            </ol>

            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-muted-foreground mb-4">
              We offer exchanges for different sizes, colors, or items of equal value.
              Exchange shipping costs are the responsibility of the customer unless the item is defective.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
            <p className="text-muted-foreground mb-4">
              Refunds are processed within 5-7 business days after we receive your returned item.
              Refunds will be issued to the original payment method.
            </p>
            <p className="text-muted-foreground">
              Please note that shipping charges are non-refundable unless the return is due to our error.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}