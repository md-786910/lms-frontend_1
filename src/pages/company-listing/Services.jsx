import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Clock, DollarSign, FileText, BarChart, Shield, 
  Smartphone, Cloud, Headphones, Settings 
} from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">
            Our Services
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Comprehensive HR solutions designed to streamline your operations and empower your workforce.
          </p>
          <Link to="/company/get-started">
            <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core HR Services</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage your workforce effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-gradient-card border-0 shadow-lg">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
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
      <section className="py-20 px-4 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Additional Services</h2>
            <p className="text-white/80 text-lg">
              Extended features to enhance your HR experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white p-12 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your HR?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of companies already using our platform to streamline their HR operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/company/get-started">
                <Button size="lg" className="px-8 bg-primary">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button variant="outline" size="lg" className="px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;