import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import MotionWrapper from "../../components/MotionWrapper";

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
      title: "Global Headquarters",
      details: ["123 Innovation Drive", "Tech Valley, CA 94043", "United States"]
    },
    {
      icon: Phone,
      title: "Direct Line",
      details: ["+1 (888) 555-0123", "Mon-Fri 9AM-6PM PST"]
    },
    {
      icon: Mail,
      title: "Email Support",
      details: ["enterprise@leanport.com", "support@leanport.com"]
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: ["Monday - Friday: 24 Hours", "Weekend: Emergency Only"]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <MotionWrapper>
        {/* Hero Section */}
        <section className="relative py-24 px-6 text-center overflow-hidden bg-[#020817]">
           {/* Background Gradients */}
           <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] -z-10" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] -z-10" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-enter">
              <MessageSquare className="h-3 w-3" /> We're here to help
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have questions about our enterprise solutions? Our team is ready to provide answers.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-6 relative bg-slate-50">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
              {/* Contact Form */}
              <Card className="border border-slate-200 shadow-xl bg-white">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold text-slate-900">Send us a Message</CardTitle>
                  <p className="text-slate-500 mt-2">Fill out the form below and we'll get back to you shortly.</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        rows={5}
                        className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-lg shadow-blue-600/20">
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-10 lg:pt-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-6">Contact Information</h2>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    Prefer to reach out directly? Our support team is available 24/7 to assist you with any inquiries.
                  </p>
                </div>

                <div className="grid gap-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group bg-white">
                      <CardContent className="p-6 flex items-start gap-5">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <info.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-slate-500 text-sm">
                              {detail}
                            </p>
                          ))}
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
        <section className="py-24 px-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Quick Answers</h2>
              <p className="text-slate-500 text-lg">
                Common questions from our prospective partners
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">How quickly can we onboard?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our dedicated success team ensures most enterprise clients are fully operational within 5 business days.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Do you offer custom SLA?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Yes, enterprise plans come with customizable Service Level Agreements to meet your compliance needs.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Data migration support?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We provide full migration assistance from legacy systems like SAP, Oracle, or spreadsheets.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Security certifications?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We are SOC2 Type II certified, GDPR compliant, and host data on AWS ISO 27001 secure servers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </MotionWrapper>
    </div>
  );
};

export default Contact;