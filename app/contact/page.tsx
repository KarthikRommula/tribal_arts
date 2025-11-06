"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Support</h3>
                  <p className="text-muted-foreground mb-2">
                    Have questions about your order or our products?
                  </p>
                  <p className="text-sm">
                    Email: support@tribalarts.com<br />
                    Phone: (555) 123-4567<br />
                    Hours: Mon-Fri 9AM-6PM EST
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Artisan Partnerships</h3>
                  <p className="text-muted-foreground mb-2">
                    Interested in partnering with us?
                  </p>
                  <p className="text-sm">
                    Email: partnerships@tribalarts.com
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <p className="text-muted-foreground mb-2">
                    Media, press, or other questions
                  </p>
                  <p className="text-sm">
                    Email: hello@tribalarts.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}