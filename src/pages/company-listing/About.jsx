import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Globe, Heart, Building, Target } from "lucide-react";
import MotionWrapper from "../../components/MotionWrapper";

const About = () => {
  const stats = [
    { value: "10k+", label: "Companies Trust Us", color: "text-blue-600", bg: "bg-blue-50" },
    { value: "500k+", label: "Employees Managed", color: "text-green-600", bg: "bg-green-50" },
    { value: "99.9%", label: "Uptime Guarantee", color: "text-purple-600", bg: "bg-purple-50" },
    { value: "24/7", label: "Customer Support", color: "text-orange-600", bg: "bg-orange-50" }
  ];

  const values = [
    {
      icon: Users,
      title: "People First",
      description: "We build technology that empowers humans, not replaces them."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We set high standards for our product, support, and company culture."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Continuously evolving our platform to define the future of work."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Operating with transparency, honesty, and respect in all interactions."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <MotionWrapper>
        {/* Hero Section */}
        <section className="relative py-24 px-6 text-center overflow-hidden bg-[#020817]">
           {/* Background Gradients */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -z-10" />
           
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-enter">
              <Building className="h-3 w-3" /> Our Story
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">
              Empowering the World's Workforce
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to transform how companies manage their most valuable asset—their people.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-6 -mt-16 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-6">The Origin Story</h2>
              <div className="prose prose-lg max-w-none text-slate-500 leading-relaxed text-left md:text-center">
                <p className="mb-6">
                  Founded in 2020, our HRMS platform was born out of frustration with outdated, 
                  complex HR systems that made simple tasks unnecessarily difficult. Our founders 
                  recognized the need for a modern solution that could adapt to the evolving workplace.
                </p>
                <p>
                  Today, we serve thousands of forward-thinking companies worldwide. We're proud to 
                  be at the forefront of HR technology, helping organizations create better 
                  employee experiences and streamlined operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
                <Target className="h-3 w-3" /> Core Principles
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Our Values</h2>
              <p className="text-slate-500 text-lg">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border border-slate-200 shadow-sm hover:border-blue-200 bg-white group">
                  <CardHeader className="flex flex-col items-center pt-8">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                      <value.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </MotionWrapper>
    </div>
  );
};

export default About;