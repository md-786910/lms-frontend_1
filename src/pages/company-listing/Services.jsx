import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Clock, DollarSign, FileText, BarChart, Shield, 
  Smartphone, Cloud, Headphones, Settings 
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";
import visionImage from "../../assets/images/vision.png";
import ScrollRevealSection from "@/components/landing/ScrollRevealSection";

const Services = () => {
  const coreServices = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Complete employee lifecycle management from onboarding to offboarding",
      features: ["Employee profiles", "Role management", "Department organization", "Document storage"]
    },
    {
      icon: Clock,
      title: "Time & Attendance",
      description: "Accurate time tracking with automated reporting and compliance",
      features: ["Clock in/out", "Timesheet management", "Overtime tracking", "Leave management"]
    },
    {
      icon: DollarSign,
      title: "Payroll Management",
      description: "Automated payroll processing with tax compliance and reporting",
      features: ["Salary calculation", "Tax deductions", "Pay slip generation", "Bank integration"]
    },
    {
      icon: FileText,
      title: "Leave Management",
      description: "Streamlined leave requests and approval workflows",
      features: ["Leave requests", "Approval workflows", "Leave balance", "Holiday calendar"]
    },
    {
      icon: BarChart,
      title: "Analytics & Reports",
      description: "Comprehensive insights and reports for data-driven decisions",
      features: ["Custom reports", "Performance metrics", "Compliance reports", "Dashboard insights"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with full compliance support",
      features: ["Data encryption", "GDPR compliance", "Access controls", "Audit trails"]
    }
  ];

const additionalServices = [
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Full-featured mobile app for employees and managers"
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Reliable, scalable cloud hosting with 99.9% uptime"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support and technical assistance"
    },
    {
      icon: Settings,
      title: "Custom Integration",
      description: "API access and custom integrations with your existing tools"
  }
];

const servicePillars = [
  {
    title: "Plan smart",
    description: "Align policies, leave allowances, and payroll periods in one intuitive admin hub.",
  },
  {
    title: "Automate confidently",
    description: "Trigger approvals, reminders, and escalations exactly when they are needed.",
  },
  {
    title: "Measure impact",
    description: "Track SLA compliance, team capacity, and usage in real time dashboards.",
  },
];

  return (
    <div className="landing-shell min-h-screen">
      {/* Hero Section */}
      <ScrollRevealSection className="py-24 px-4 bg-[#222785] relative overflow-hidden">
        <div className="max-w-[1580px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* LEFT: CONTENT (LARGE) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.5em] text-[#CBEFFF]">
              Service Management
            </div>
            <h1 className="landing-h1">
              Services Designed to Simplify Leave Management—End to End
            </h1>
            {/* Large description */}
            <p className="landing-body max-w-3xl">
              Our Leave Management System simplifies the entire leave lifecycle—from employee requests and manager approvals to balance tracking and reporting. Built for modern organizations, it automates workflows, reduces manual effort, and gives managers real-time visibility into team availability.
            </p>
            {/* Small supporting line */}
            <p className="landing-body">
              Clear workflows. Faster decisions. Better balance for teams.
            </p>
            <Link to="/company/get-started">
              <Button
                size="lg"
                className="px-8 bg-white text-[#0f172a] hover:bg-[#222875] hover:text-white transition-colors duration-300 hover:border hover:border-white/30"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
          {/* RIGHT: IMAGE (SMALL) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-2xl">
              <img
                src={visionImage}
                alt="Leave Management Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </ScrollRevealSection>



      {/* Core Services */}
      <ScrollRevealSection className="relative py-24 px-4 overflow-hidden bg-[#CBEFFF]">
        {/* Soft background shape */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#222785]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/60 blur-2xl" />
        </div>

        <div className="relative max-w-[1580px] mx-auto space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="landing-h2 landing-h2-dark mb-6">
              HR Services Focused on Smarter Leave Management
            </h2>

            <p className="landing-body landing-body-dark leading-relaxed">
              Our HR services are designed to simplify and automate leave management
              across the organization. From employee leave requests to approvals,
              tracking, and reporting—everything works together to reduce manual effort,
              improve transparency, and keep teams productive.
            </p>
          </div>
          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <div
                key={index}
                className="
                  group relative bg-white rounded-2xl p-8
                  border border-[#222785]/10
                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-[0_20px_40px_rgba(34,39,133,0.15)]
                  hover:border-[#222785]/30
                "
              >
                {/* Icon */}
                <div className="
                  w-14 h-14 flex items-center justify-center rounded-xl
                  bg-[#CBEFFF]
                  mb-6
                  group-hover:bg-[#222785]/10
                  transition
                ">
                  <service.icon className="h-7 w-7 text-[#222785]" />
                </div>
            
                {/* Title */}
                <h3 className="landing-h3 text-[#222785] mb-3">
                  {service.title}
                </h3>
            
                {/* Description */}
                <p className="landing-card-text mb-6">
                  {service.description}
                </p>
            
                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                    className="landing-card-text flex items-start gap-3"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#222785]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>
      {/* Additional Services */}
      <ScrollRevealSection className="relative py-24 px-4 bg-white">
        <div className="max-w-[1580px] mx-auto space-y-16">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="landing-h2 landing-h2-dark mb-4">Additional Services</h2>
            <p className="landing-body landing-body-dark">
              Extend your leave management experience with powerful, supportive services built for modern HR teams.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="
                  group bg-[#CBEFFF]/40 rounded-2xl p-8 text-center
                  border border-[#222785]/10
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-[0_20px_40px_rgba(34,39,133,0.12)]
                "
              >
                <div className="
                  w-14 h-14 mx-auto mb-5 rounded-xl
                  flex items-center justify-center
                  bg-white
                  group-hover:bg-[#222785]/10
                  transition
                ">
                  <service.icon className="h-7 w-7 text-[#222785]" />
                </div>
            
                <h3 className="landing-h3 text-[#222785] mb-2">
                  {service.title}
                </h3>
            
                <p className="landing-card-text text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>
      {/* Approach Section */}
      <ScrollRevealSection className="relative py-28 px-4 bg-[#CBEFFF]">
        <div className="max-w-[1580px] mx-auto space-y-20">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="landing-subheading mb-3">How we partner</p>
            <h2 className="landing-h2 landing-h2-dark mb-4">
              Services that match how modern HR works
            </h2>
            <p className="landing-body landing-body-dark">
              Every implementation is guided by the principles modern HR teams rely on—speed, accuracy, transparency, and trust.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            {servicePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="
                  bg-white rounded-2xl p-8
                  border border-[#222785]/10
                  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                  hover:shadow-[0_20px_40px_rgba(34,39,133,0.12)]
                  transition-all
                "
              >
                <h3 className="landing-h3 text-[#222785] mb-3">
                  {pillar.title}
                </h3>
                <p className="landing-card-text text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="
            bg-white rounded-3xl p-10
            border border-[#222785]/10
            flex flex-col md:flex-row items-center justify-between gap-6
            shadow-[0_20px_50px_rgba(0,0,0,0.08)]
          ">
            <div className="space-y-2">
              <p className="text-[#131313] font-bold">Book a session</p>
              <h3 className="landing-h2 landing-h2-dark">
                Let’s audit your HR workflow and share a tailored roadmap
              </h3>
            </div>
          
            <Link to="/company/contact">
              <Button
                size="lg"
                className="bg-[#222785] text-white px-10 hover:bg-[#1b1f6b] transition"
              >
                Talk to our team
              </Button>
            </Link>
          </div>
          
        </div>
      </ScrollRevealSection>
      <ScrollRevealSection
        className="py-20 px-4 text-center"
        delay={440}
        threshold={0.25}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="landing-h2 landing-h2-dark">Tackle HR complexity with clarity</h2>
          <p className="landing-body landing-body-dark">
            Our flexible platform adapts to your policies, payroll, and processes. Ready to lead with confidence?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/company/get-started">
              <Button size="lg" className="bg-primary text-white">
                Launch a pilot
              </Button>
            </Link>
            <Link to="/company/contact">
              <Button size="lg" variant="outline" className="border border-primary text-primary hover:bg-primary hover:text-[#CBEFFF]">
                Talk with sales
              </Button>
            </Link>
          </div>
        </div>
      </ScrollRevealSection>
      <LandingFooter />
    </div>
  );
};

export default Services;
