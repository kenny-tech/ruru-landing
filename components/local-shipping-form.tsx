"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"

interface LocalShippingFormProps {
  onBack: () => void
}

export function LocalShippingForm({ onBack }: LocalShippingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    fromCountry: "",
    fromState: "",
    fromCity: "",
    toCountry: "",
    toState: "",
    toCity: "",
    currency: "",
    estimatedWeight: "",
    itemDescription: "",
    natureOfItem: "",
    itemImage: null as File | null,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, itemImage: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.fromCountry ||
      !formData.fromState ||
      !formData.fromCity ||
      !formData.toCountry ||
      !formData.toState ||
      !formData.toCity ||
      !formData.currency ||
      !formData.estimatedWeight ||
      !formData.itemDescription ||
      !formData.natureOfItem ||
      !formData.itemImage
    ) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    const form = new FormData()
    form.append("firstname", formData.fullName)
    form.append("email", formData.email)
    form.append("phoneNumber", formData.phone)
    form.append("originCountry", formData.fromCountry)
    form.append("originCity", formData.fromCity)
    form.append("originState", formData.fromState)
    form.append("destinationCountry", formData.toCountry)
    form.append("destinationCity", formData.toCity)
    form.append("destinationState", formData.toState)
    form.append("currency", formData.currency.toUpperCase())
    form.append("weight", formData.estimatedWeight)
    form.append("itemDescription", formData.itemDescription)
    form.append("nature", formData.natureOfItem.toUpperCase())
    form.append("file", formData.itemImage)

    try {
      const response = await fetch('https://ruru-backend.onrender.com/api/v1/demo/request-local-demo-shipping', {
        method: "POST",
        body: form,
      })

      const result = await response.json()

      if (result.success) {
        setTimeout(() => {
          toast.success("Local demo shipping request submitted successfully!")
        }, 2000)
        window.location.reload() // reloads the current page
      } else {
        toast.error(result.message || "Something went wrong.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while submitting the form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Local Shipping</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to get your local shipping quote</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* From Location */}
          <Card>
            <CardHeader><CardTitle>Shipping From</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fromCountry">Country</Label>
                <Input id="fromCountry" value={formData.fromCountry} onChange={(e) => setFormData({ ...formData, fromCountry: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="fromState">State</Label>
                <Input id="fromState" value={formData.fromState} onChange={(e) => setFormData({ ...formData, fromState: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="fromCity">City</Label>
                <Input id="fromCity" value={formData.fromCity} onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* To Location */}
          <Card>
            <CardHeader><CardTitle>Shipping To</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="toCountry">Country</Label>
                <Input id="toCountry" value={formData.toCountry} onChange={(e) => setFormData({ ...formData, toCountry: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="toState">State</Label>
                <Input id="toState" value={formData.toState} onChange={(e) => setFormData({ ...formData, toState: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="toCity">City</Label>
                <Input id="toCity" value={formData.toCity} onChange={(e) => setFormData({ ...formData, toCity: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngn">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedWeight">Estimated Weight (KG)</Label>
                <Input id="estimatedWeight" type="number" step="0.1" value={formData.estimatedWeight} onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea id="itemDescription" value={formData.itemDescription} onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="natureOfItem">Nature of Item</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, natureOfItem: value })}>
                  <SelectTrigger><SelectValue placeholder="Select item nature" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fragile">Fragile</SelectItem>
                    <SelectItem value="non-fragile">Non-Fragile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="itemImage">Item Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" id="itemImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="itemImage" className="cursor-pointer block">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.itemImage ? formData.itemImage.name : "Click to upload item image"}
                    </p>
                  </label>
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="Preview" className="mx-auto h-40 rounded-md object-contain border" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EF7D35] hover:bg-orange-700 text-white py-3"
          >
            {isSubmitting ? "Submitting..." : "Submit Local Shipping Quote Request"}
          </Button>
        </form>
      </div>
    </div>
  )
}
