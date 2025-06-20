"use client"

import React, { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"

interface InternationalShippingFormProps {
  onBack: () => void
}

export function InternationalShippingForm({ onBack }: InternationalShippingFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    origin: "",
    destination: "",
    quantity: "",
    weight: "",
    value: "",
    itemDescription: "",
    natureOfItem: "",
    itemImage: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, itemImage: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const {
      fullName,
      email,
      phone,
      origin,
      destination,
      quantity,
      weight,
      value,
      itemDescription,
      natureOfItem,
      itemImage,
    } = formData

    if (
      !fullName ||
      !email ||
      !phone ||
      !origin ||
      !destination ||
      !quantity ||
      !weight ||
      !value ||
      !itemDescription ||
      !natureOfItem ||
      !itemImage
    ) {
      toast.error("Please fill in all fields.")
      return
    }

    const form = new FormData()
    form.append("fullname", fullName)
    form.append("email", email)
    form.append("phoneNumber", phone)
    form.append("origin", origin)
    form.append("destination", destination)
    form.append("quantity", quantity)
    form.append("weight", weight)
    form.append("value", value)
    form.append("itemDescription", itemDescription)
    form.append("nature", natureOfItem.toUpperCase())
    form.append("file", itemImage)

    try {
      setIsSubmitting(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/demo/request-international-demo-shipping`, {
        method: "POST",
        body: form,
      })

      const result = await res.json()

      if (result.success) {
        setTimeout(() => {
          toast.success("International shipping request submitted!")
        }, 2000)
        window.location.reload() // reloads the current page
      } else {
        toast.error(result.message || "Something went wrong.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error submitting form.")
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
          <h1 className="text-3xl font-bold text-gray-900">International Shipping</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to get your international shipping quote</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details */}
          <Card>
            <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Country/City of origin"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Country/City of destination"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (KG)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="value">Value (₦)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea
                  id="itemDescription"
                  value={formData.itemDescription}
                  onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                  placeholder="Describe the item you're shipping..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="natureOfItem">Nature of Item</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, natureOfItem: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item nature" />
                  </SelectTrigger>
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
                  <label htmlFor="itemImage" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {formData.itemImage ? formData.itemImage.name : "Click to upload item image"}
                    </p>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mx-auto mt-4 h-32 object-contain" />}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EF7D35] hover:bg-orange-700 text-white py-3"
          >
            {isSubmitting ? "Submitting..." : "Submit International Shipping Quote Request"}
          </Button>
        </form>
      </div>
    </div>
  )
}
