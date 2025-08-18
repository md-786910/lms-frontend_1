import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Clock, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Comprehensive employee database with profiles, roles, and departments"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Accurate clock in/out system with automated timesheet generation"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Real-time insights and reports for better decision making"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with GDPR compliance"
    }
  ];

  const benefits = [
    "Reduce HR workload by 80%",
    "Improve employee satisfaction",
    "Automate payroll processing",
    "Real-time attendance tracking",
    "Generate compliance reports",
    "Mobile-first design"
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Modern HR Management
            <span className="text-white/90 block mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Streamline your HR processes with our comprehensive HRMS solution. 
            From employee onboarding to performance tracking, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/company/get-started">
              <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">
                <Zap className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/company/contact">
              <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our HRMS?</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to manage your workforce effectively
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-card border-0 shadow-lg">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                Transform Your HR Operations
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Join thousands of companies that have revolutionized their HR processes 
                with our intelligent automation and intuitive design.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Start your free trial today and see the difference our HRMS can make.
              </p>
              <Link to="/company/get-started">
                <Button className="w-full bg-primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;