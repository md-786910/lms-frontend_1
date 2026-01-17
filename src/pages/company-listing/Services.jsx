import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Clock, DollarSign, FileText, BarChart, Shield, 
  Smartphone, Cloud, Headphones, Settings, ArrowRight, Layers 
} from "lucide-react";
import { Link } from "react-router-dom";
import MotionWrapper from "../../components/MotionWrapper";

const Services = () => {
  const coreServices = [
    {
      icon: Users,
      title: "Employee Lifecycle",
      description: "End-to-end management from recruitment to offboarding.",
      features: ["Digital Onboarding", "Role-Based Access", "Document Vault", "Org Charts"]
    },
    {
      icon: Clock,
      title: "Smart Attendance",
      description: "Precision time tracking with geofencing and biometrics.",
      features: ["Real-time Sync", "Shift Management", "Overtime Calc", "Mobile Punch-in"]
    },
    {
      icon: DollarSign,
      title: "Automated Payroll",
      description: "Error-free salary processing with tax compliance.",
      features: ["Auto-Tax Deduction", "Payslip Generation", "Expense Claims", "Bank Direct Transfer"]
    },
    {
      icon: FileText,
      title: "Leave & Holidays",
      description: "Simplified leave requests with multi-level approval flows.",
      features: ["Custom Policies", "Calendar View", "Balance Tracking", "Comp-off Mgmt"]
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Actionable insights to drive better HR decisions.",
      features: ["Attrition Trends", "Performance KPIs", "Custom Reports", "Real-time Dashboards"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade data protection and regulatory compliance.",
      features: ["AES-256 Encryption", "Audit Logs", "GDPR Ready", "2FA Security"]
    }
  ];

  const additionalServices = [
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Native iOS and Android apps for the workforce on the go."
    },
    {
      icon: Cloud,
      title: "Cloud Native",
      description: "99.99% uptime SLA with globally distributed infrastructure."
    },
    {
      icon: Headphones,
      title: "Premium Support",
      description: "Dedicated account managers and 24/7 technical assistance."
    },
    {
      icon: Settings,
      title: "API Integrations",
      description: "Seamlessly connect with Slack, Teams, and ERP systems."
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
              <Layers className="h-3 w-3" /> Comprehensive Suite
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">
              Built for Modern HR Teams
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              A unified platform replacing fragmented tools. Experience the power of integration.
            </p>
            <Link to="/company/get-started">
              <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>

        {/* Core Services */}
        <section className="py-24 px-6 relative bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Core Capabilities</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Everything you need to manage your workforce effectively, all in one place.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreServices.map((service, index) => (
                <Card key={index} className="group hover:-translate-y-1 transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 bg-white">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 mb-6 leading-relaxed text-sm">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-3 text-slate-700 font-medium">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
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
        <section className="py-24 px-6 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Enterprise Extensions</h2>
              <p className="text-slate-500 text-lg">
                Scale your operations with our advanced add-ons.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="text-center hover:bg-slate-50 transition-colors border border-slate-100 shadow-none hover:border-slate-200">
                  <CardHeader className="flex flex-col items-center pt-8">
                    <div className="p-3 bg-slate-100 rounded-full mb-4 text-slate-900">
                        <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative bg-[#020817] overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Ready to Upgrade Your HR?</h2>
                <p className="text-xl text-slate-400 mb-10">
                    Join forward-thinking companies building better workplaces.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/company/get-started">
                        <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link to="/company/contact">
                        <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full">
                            Contact Sales
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </MotionWrapper>
    </div>
  );
};

export default Services;