"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "Are your products authentic indigenous crafts?",
      answer: "Yes, all our products are created by indigenous artisans using traditional techniques and materials. We work directly with artisans from various communities to ensure authenticity and fair compensation."
    },
    {
      question: "How do you ensure fair trade practices?",
      answer: "We partner directly with artisan cooperatives and individual craftsmen, ensuring they receive fair compensation for their work. We also support community development projects and cultural preservation initiatives."
    },
    {
      question: "What materials are used in your products?",
      answer: "Our products use traditional materials such as natural fibers, wood, stone, metal, and pigments derived from natural sources. We prioritize sustainable and eco-friendly materials whenever possible."
    },
    {
      question: "Do you offer customization?",
      answer: "Some artisans offer customization services. Please contact us for specific requests, and we'll work with our artisan partners to accommodate your needs."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location and product. Most orders ship within 3-5 business days, with delivery taking 7-14 days depending on your location. International orders may take longer."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition. Due to the handmade nature of our items, some products may not be eligible for return. Please see our full returns policy for details."
    },
    {
      question: "How do you care for your products?",
      answer: "Care instructions vary by product type. Generally, avoid direct sunlight, extreme temperatures, and excessive moisture. Clean with a soft cloth and mild soap when necessary. Specific care instructions are included with each purchase."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Additional customs fees may apply."
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our products and services
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}