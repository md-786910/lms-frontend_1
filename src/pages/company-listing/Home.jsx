import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Clock, TrendingUp, Shield, Zap, ArrowRight, BarChart3, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import MotionWrapper from "../../components/MotionWrapper";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Centralized database for profiles, roles, and organizational structure."
    },
    {
      icon: Clock,
      title: "Smart Time Tracking",
      description: "Automated attendance, geofencing, and timesheet generation."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Data-driven insights to optimize workforce productivity."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and GDPR/SOC2 compliance."
    }
  ];

  const benefits = [
    "Reduce administrative overhead by 80%",
    "Boost employee engagement & retention",
    "Zero-error automated payroll processing",
    "Real-time attendance & leave tracking",
    "Instant compliance report generation",
    "Seamless mobile-first experience"
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <MotionWrapper>
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-6 overflow-hidden bg-[#020817]">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-enter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              The Future of Work is Here
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
              Manage Your Workforce <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Without the Chaos
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              The all-in-one HRMS platform designed for modern enterprises. 
              Streamline operations, automate payroll, and empower your team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/company/get-started">
                <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
                  <Zap className="mr-2 h-5 w-5 fill-current" />
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 font-bold rounded-full">
                  Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm shadow-2xl overflow-hidden animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none" />
              <div className="p-2 border-b border-slate-800 flex items-center gap-2 bg-slate-900/80">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
              </div>
              <div className="aspect-[16/9] bg-slate-950 flex items-center justify-center text-slate-800 font-black text-4xl uppercase tracking-widest">
                {/* Replace with actual dashboard screenshot later */}
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <BarChart3 className="h-24 w-24" />
                  <span>Interactive Dashboard UI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                Everything You Need
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                A complete suite of tools built to handle the complexities of modern HR management.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:-translate-y-2 transition-all duration-300 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-500/20 bg-white">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <feature.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-6 bg-[#020817] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-transparent" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Globe className="h-3 w-3" /> Global Scale
                </div>
                <h2 className="text-4xl font-black text-white mb-6 tracking-tight">
                  Transform Your Operations
                </h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                  Join forward-thinking companies that have revolutionized their HR processes. 
                  Say goodbye to spreadsheets and hello to intelligent automation.
                </p>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-200 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20" />
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl relative shadow-2xl">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/30">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Ready to Launch?</h3>
                    <p className="text-slate-400 mb-8">
                      Get full access to all premium features for 14 days. No credit card required.
                    </p>
                    <Link to="/company/get-started">
                      <Button className="w-full h-14 text-lg font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-xl">
                        Start Free Trial
                      </Button>
                    </Link>
                    <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest font-bold">
                       Trusted by 500+ Companies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionWrapper>
    </div>
  );
};

export default Home;