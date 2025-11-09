import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react"; // ✅ ADDED React import for state

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ADDED state for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Mock API call success
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully! ✅",
        description: `Thank you, ${formData.name}. We'll get back to you within 24 hours at ${formData.email}.`,
      });
      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form (2/3 width) */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Get in Touch with Support
            </h1>
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or need assistance? Fill out the form below and we'll connect you with the right team.
            </p>

            <Card className="glass-card p-6 border-border/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="E.g., Issue with Resident Certificate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your issue or feedback in detail..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                >
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card p-6 border-border/50 space-y-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Our Office Details
              </h2>
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Call Center
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    +255 123 456 789 (Toll Free)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available: 8 AM - 4 PM
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    General Enquiries
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    info@smartgov.go.tz
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Support@smartgov.go.tz
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Headquarters
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    President's Office - Regional <br />
                    Administration and Local Government (PO-RALG)<br />
                    Dodoma, Tanzania
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Working Hours
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: **8:00 AM - 4:00 PM**
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Saturday - Sunday: **Closed**
                  </p>
                  <p className="text-sm text-primary mt-2">
                    Online Services: **24/7**
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
              <h3 className="font-semibold text-foreground mb-3">
                Quick Answers
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find instant solutions to common issues by visiting our Information Center.
              </p>
              <Button onClick={() => navigate("/info")} className="w-full">
                Visit Information Center
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;