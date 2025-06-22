"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Clock, MapPin, Shield } from "lucide-react"
import Image from "next/image"
import { QuoteModal } from "@/components/quote-modal"
import { LocalShippingForm } from "@/components/local-shipping-form"
import { InternationalShippingForm } from "@/components/international-shipping-form"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type ViewState = "landing" | "local-form" | "international-form"

export default function RuruLanding() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>("landing")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectLocal = () => {
    setIsQuoteModalOpen(false)
    setCurrentView("local-form")
  }

  const handleSelectInternational = () => {
    setIsQuoteModalOpen(false)
    setCurrentView("international-form")
  }

  const handleBackToLanding = () => {
    setCurrentView("landing")
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, subject, message } = contactForm
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/get-in-touch`, contactForm)
      if (response.data.success) {
        toast.success("Message sent successfully!")
        setContactForm({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error(response.data.message || "Failed to send message.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while sending your message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (currentView === "local-form") return <LocalShippingForm onBack={handleBackToLanding} />
  if (currentView === "international-form") return <InternationalShippingForm onBack={handleBackToLanding} />

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="RURU Logo"
                width={300}
                height={100}
                className="h-8 w-auto"
              />
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#EF7D35] font-medium smooth-scroll">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#EF7D35] font-medium smooth-scroll">
                How It Works
              </a>
              <a href="#download" className="text-gray-700 hover:text-[#EF7D35] font-medium smooth-scroll">
                Download
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#EF7D35] font-medium smooth-scroll">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* <Link href="#" className="text-gray-700 hover:text-[#EF7D35] font-medium hidden md:block">
                Log In
              </Link> */}
              {/* <Button className="bg-[#EF7D35] hover:bg-orange-700 text-white">Download App</Button> */}
              <Button
                onClick={() => setIsQuoteModalOpen(true)}
                variant="outline"
                className="bg-[#EF7D35] hover:bg-orange-700 text-white hover:text-white"
              >
                Request Quote
              </Button>
              {/* <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#EF7D35] leading-tight">
                Seamless Logistics at <span className="text-[#EF7D35]">Your Fingertips</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Experience fast, reliable, and secure delivery services with real-time tracking and flexible pickup
                options. Get your packages delivered safely and on time.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/googleplay.png"
                    alt="Get it on Google Play"
                    width={300}
                    height={100}
                    className="h-12 w-auto"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/appstore.png"
                    alt="Download on the App Store"
                    width={300}
                    height={100}
                    className="h-12 w-auto"
                  />
                </a>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/ruru.jpeg?height=400&width=500"
                alt="Delivery person on motorcycle"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RURU Section */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-orange-100 text-[#EF7D35] text-sm font-medium rounded-full mb-4">
              Features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#7A315F]">Why Choose RURU?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our logistics app is designed to make parcel delivery seamless and transparent.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-[#EF7D35]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Easy Online Access</h3>
                  <p className="mt-2 text-gray-600">
                    Book and manage your deliveries online with our user-friendly app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-[#EF7D35]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Real-Time Tracking</h3>
                  <p className="mt-2 text-gray-600">
                    Track your packages in real-time and get updates on delivery status
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-[#EF7D35]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Flexible Location Sharing</h3>
                  <p className="mt-2 text-gray-600">Share precise locations for accurate and timely deliveries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[#EF7D35]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Secure Deliveries</h3>
                  <p className="mt-2 text-gray-600">
                    Your packages are safe with our secure handling and delivery process
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/chooseruru.jpg?height=400&width=500"
                alt="Delivery professional"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How RURU Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-orange-100 text-[#EF7D35] text-sm font-medium rounded-full mb-4">
              How It Works
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#7A315F]">How RURU Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Getting your packages delivered is easy with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EF7D35] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Pickup</h3>
              <p className="text-gray-600">
                Schedule a pickup time and location that works best for you through our app
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#EF7D35] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track in Real-Time</h3>
              <p className="text-gray-600">
                Monitor your package journey with live tracking updates and delivery notifications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#EF7D35] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delivery</h3>
              <p className="text-gray-600">
                Receive confirmation when your package is safely delivered to its destination
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get RURU App Section */}
      <section id="download" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/getruruapp.jpg?height=400&width=500"
                alt="Person using RURU app"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-orange-100 text-[#EF7D35] text-sm font-medium rounded-full mb-4">
                Download
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#7A315F]">Get RURU App Today</h2>
              <p className="mt-6 text-lg text-gray-600">
                Download our mobile app for the most convenient way to manage your deliveries. Available on both iOS and
                Android platforms.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/googleplay.png"
                    alt="Get it on Google Play"
                    width={300}
                    height={100}
                    className="h-12 w-auto"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/appstore.png"
                    alt="Download on the App Store"
                    width={300}
                    height={100}
                    className="h-12 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section id="contact" className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-orange-100 text-[#EF7D35] text-sm font-medium rounded-full mb-4">
              Contact
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#7A315F]">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">Have questions or need support? We'd love to hear from you.</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input id="name" placeholder="Your name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input id="email" type="email" placeholder="your@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input id="subject" placeholder="How can we help?" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea id="message" rows={5} placeholder="Tell us more about your inquiry..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#EF7D35] hover:bg-orange-700 text-white">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="RURU Logo"
                width={300}
                height={100}
                className="h-8 w-auto"
              />
            </div>

            <nav className="flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#EF7D35] text-sm">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#EF7D35] text-sm">
                How It Works
              </a>
              <a href="#download" className="text-gray-600 hover:text-[#EF7D35] text-sm">
                Download
              </a>
              <a href="#contact" className="text-gray-600 hover:text-[#EF7D35] text-sm">
                Contact
              </a>
            </nav>

            <div className="text-sm text-gray-500">© 2025 RURU. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSelectLocal={handleSelectLocal}
        onSelectInternational={handleSelectInternational}
      />
    </div>
  )
}
