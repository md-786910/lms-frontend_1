import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import LandingFooter from "@/components/landing/LandingFooter";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Add toast notification or success message
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      details: ["123 Business Street", "Tech City, TC 12345", "United States"]
    },
    {
      icon: Phone,
      title: "Phone Number",
      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"]
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["sales@hrms.com", "support@hrms.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM", "Sunday: Closed"]
    }
  ];

  return (
    <div className="landing-shell min-h-screen">
      {/* Hero Section */}
      <section className="landing-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-black"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[#0f172a]">
            Get in Touch
          </h1>
          <p className="text-xl text-[#0f172a]/70">
            Have questions about our HRMS? We're here to help you find the perfect solution for your business.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="landing-panel border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#0f172a]">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your HR needs and how we can help..."
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#EAF7FF] text-[#0f172a]"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[#0f172a]">
                  Contact Information
                </h2>
                <p className="text-[#0f172a]/70 mb-8">
                  Reach out to us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="landing-panel border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <info.icon className="h-6 w-6 text-[#0f172a] mt-1" />
                        <div>
                          <h3 className="font-semibold mb-2 text-[#0f172a]">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-[#0f172a]/70 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">
              Quick Answers
            </h2>
            <p className="text-[#0f172a]/70 text-lg">
              Common questions from our customers
            </p>
          </div>
          <div className="landing-panel p-8 rounded-xl border-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2 text-[#0f172a]">
                  How quickly can we get started?
                </h3>
                <p className="text-[#0f172a]/70 text-sm">
                  Most companies are up and running within 24-48 hours of signing up.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#0f172a]">
                  Do you offer training?
                </h3>
                <p className="text-[#0f172a]/70 text-sm">
                  Yes, we provide comprehensive onboarding and training for all new customers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#0f172a]">
                  Can you migrate our existing data?
                </h3>
                <p className="text-[#0f172a]/70 text-sm">
                  Absolutely! Our team will help you migrate all your existing HR data seamlessly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-[#0f172a]">
                  What about data security?
                </h3>
                <p className="text-[#0f172a]/70 text-sm">
                  We use enterprise-grade security with encryption and comply with all major standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export default Contact;
