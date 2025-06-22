"use client"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Truck, Globe } from "lucide-react"

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocal: () => void
  onSelectInternational: () => void
}

export function QuoteModal({ isOpen, onClose, onSelectLocal, onSelectInternational }: QuoteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Request a Quote</h2>
          <p className="text-gray-600 text-center mb-8">Choose your shipping type to get started</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelectLocal}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-[#EF7D35]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Shipping</h3>
                <p className="text-gray-600 mb-4">
                  Domestic deliveries within your country.
                </p>
                <Button className="w-full bg-[#EF7D35] hover:bg-orange-700 text-white">Get Local Quote</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelectInternational}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-[#EF7D35]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">International Shipping</h3>
                <p className="text-gray-600 mb-4">
                  International deliveries across countries.
                </p>
                <Button className="w-full bg-[#EF7D35] hover:bg-orange-700 text-white">Get International Quote</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
