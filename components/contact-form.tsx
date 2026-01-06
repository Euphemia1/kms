"use client"

import type React from "react"
import { useState } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, MessageSquare, Loader2, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    service_interest: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to submit")

      setSubmitted(true)
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        service_interest: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      alert("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <ScrollAnimation>
        <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} className="rounded-full">
            Send Another Message
          </Button>
        </div>
      </ScrollAnimation>
    )
  }

  return (
    <ScrollAnimation>
      <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+243 972 144 161"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Your Company"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                required
                placeholder="How can we help you?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_interest">Service Interest</Label>
              <Select
                value={formData.service_interest}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, service_interest: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction & Civil Engineering</SelectItem>
                  <SelectItem value="mining">Mining Support Services</SelectItem>
                  <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                  <SelectItem value="procurement">Procurement Services</SelectItem>
                  <SelectItem value="consulting">Engineering Consulting</SelectItem>
                  <SelectItem value="equipment">Equipment Rental</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              required
              rows={6}
              placeholder="Tell us about your project or inquiry..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </ScrollAnimation>
  )
}
