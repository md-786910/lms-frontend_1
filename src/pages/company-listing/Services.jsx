import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Clock, DollarSign, FileText, BarChart, Shield, 
  Smartphone, Cloud, Headphones, Settings 
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";

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
      <section className="landing-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-black"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[#0f172a] tracking-[0.08em]">
            Our Services
          </h1>
          <p className="text-xl text-[#0f172a]/70">
            Comprehensive HR solutions designed to streamline your operations and empower your workforce.
          </p>
          <Link to="/company/get-started">
            <Button
              size="lg"
              className="px-8 bg-white text-[#0f172a] hover:bg-white/90"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Services */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">
              Core HR Services
            </h2>
            <p className="text-[#0f172a]/70 text-lg">
              Everything you need to manage your workforce effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <Card
                key={index}
                className="landing-panel hover:border-white/30 transition-all duration-300 border-0"
              >
                <CardHeader>
                  <service.icon className="h-12 w-12 text-[#0f172a] mb-4" />
                  <CardTitle className="text-[#0f172a]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0f172a]/70 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-sm flex items-start gap-2 text-[#0f172a]/70"
                      >
                        <div className="w-1.5 h-1.5 bg-[#EAF7FF] rounded-full mt-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">
              Additional Services
            </h2>
            <p className="text-[#0f172a]/70 text-lg">
              Extended features to enhance your HR experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card
                key={index}
                className="landing-panel text-center transition-all duration-300 border-0"
              >
                <CardHeader>
                  <service.icon className="h-12 w-12 text-[#0f172a] mx-auto mb-4" />
                  <CardTitle className="text-[#0f172a]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0f172a]/70">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#0f172a]/60">
              How we partner
            </p>
            <h2 className="text-3xl font-bold text-[#0f172a]">
              Services that match how modern HR works
            </h2>
            <p className="text-[#0f172a]/70 text-lg">
              Every implementation is guided by the same principles your HR team lives by—speed, accuracy, and trust.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {servicePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="landing-panel p-6 rounded-2xl border-white/30 space-y-3"
              >
                <h3 className="text-xl font-semibold text-[#0f172a]">{pillar.title}</h3>
                <p className="text-[#0f172a]/70 text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
          <div className="landing-panel p-8 rounded-3xl border-0 flex flex-col md:flex-row items-center gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f172a]/60">
                Book a session
              </p>
              <h3 className="text-2xl font-semibold text-[#0f172a]">
                Let's audit your HR workflow and share a tailored roadmap
              </h3>
            </div>
            <Link to="/company/contact">
              <Button size="lg" className="bg-[#EAF7FF] text-[#0f172a] px-10">
                Talk to our team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="landing-panel p-12 rounded-xl border-0">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-6">
              Ready to Transform Your HR?
            </h2>
            <p className="text-xl text-[#0f172a]/70 mb-8">
              Join thousands of companies already using our platform to streamline their HR operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/company/get-started">
                <Button size="lg" className="px-8 bg-[#EAF7FF] text-[#0f172a]">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 text-[#0f172a] border-white/50"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export default Services;
