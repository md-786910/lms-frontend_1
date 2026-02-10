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
  const faqData = [
    {
      question: "How does the Leave Management System work?",
      answer:
        "Employees can easily apply for leave, managers can review and approve requests in real time, and HR teams get complete visibility into balances, policies, and leave trends—all from a single platform."
    },
    {
      question: "Can I customize leave policies for different teams?",
      answer:
        "Yes. You can create flexible leave policies based on roles, departments, locations, or employment types, ensuring accurate tracking and compliance."
    },
    {
      question: "Does the system support multiple leave types?",
      answer:
        "Absolutely. The platform supports paid leave, sick leave, casual leave, comp-off, holidays, and custom leave types tailored to your organization."
    },
    {
      question: "Is employee leave data secure?",
      answer:
        "Yes. We follow industry-standard security practices to protect employee data, ensuring privacy, reliability, and compliance."
    },
    {
      question: "Can managers see team availability in real time?",
      answer:
        "Managers get a real-time view of team availability, helping them plan workloads and avoid scheduling conflicts."
    }
  ];


  return (
    <div className="landing-shell min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative py-28 px-4 overflow-hidden bg-[#CBEFFF]">
        {/* Soft background shapes */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#222875]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full bg-white/60 blur-2xl" />
        </div>

        <div className="relative max-w-[1580px] mx-auto text-center space-y-6">
          <h1 className="landing-h1 landing-h2-dark">
            Get in Touch
          </h1>
          <p className="landing-body landing-body-dark max-w-2xl mx-auto">
            Have questions about our Leave Management System?  
            Our team is here to help you find the right solution for your organization.
          </p>
        </div>
      </section>
      {/* Contact Section */}
      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-[1580px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-14">

            {/* Contact Form */}
            <div className="interactive-card bg-white rounded-3xl p-10 border border-[#222875]/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <h2 className="landing-h2 landing-h2-dark mb-6">
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-2"
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
                      placeholder="you@company.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="mt-2"
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
                    placeholder="Tell us about your leave management needs..."
                    rows={5}
                    className="mt-2"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#222875] text-white py-6 text-lg hover:bg-[#1b1f6b] transition"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="landing-h2 landing-h2-dark mb-4">
                  Contact Information
                </h2>
                <p className="landing-body landing-body-dark max-w-md">
                  Reach out through any of the options below. Our team is ready to support you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="
                      interactive-card flex gap-5 p-6 bg-[#CBEFFF]/40 rounded-2xl
                      border border-[#222875]/10
                      hover:shadow-[0_12px_30px_rgba(34,39,133,0.15)]
                      transition
                    "
                  >
                    <div className="
                      w-12 h-12 rounded-xl bg-white
                      flex items-center justify-center
                    ">
                      <info.icon className="h-6 w-6 text-[#222875]" />
                    </div>
                
                    <div>
                      <h3 className="landing-h3 text-[#222785] mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="landing-body landing-body-dark text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div> 
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="relative py-28 px-4 bg-[#CBEFFF]">
        <div className="max-w-[1100px] mx-auto space-y-16">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[#131313] font-bold mb-3">
              FAQs
            </p>
            <h2 className="landing-h2 landing-h2-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="landing-body landing-body-dark">
              Everything you need to know about how our Leave Management System works.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="
                  group bg-white rounded-2xl p-6
                  border border-[#222875]/10
                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                  transition-all
                "
              >
                <summary className="
                  flex cursor-pointer items-center justify-between
                  list-none text-3xl text-[#222785]
                ">
                  {faq.question}
                  <span className="
                    ml-4 flex h-8 w-8 items-center justify-center
                    rounded-full bg-[#CBEFFF]
                    group-open:rotate-45 transition-transform
                  ">
                    +
                  </span>
                </summary>
           
                <p className="landing-body landing-body-dark mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center pt-10">
            <p className="landing-body landing-body-dark mb-4">
              Still have questions?
            </p>
            <a
              href="/company/contact"
              className="
                inline-flex items-center justify-center
                px-8 py-4 rounded-xl
                bg-[#222875] text-white
                hover:bg-[#1b1f6b] transition
              "
            >
              Talk to our team
            </a>
          </div>
          
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Contact;
