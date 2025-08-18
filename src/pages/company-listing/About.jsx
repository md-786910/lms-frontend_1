import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Globe, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { value: "10,000+", label: "Companies Trust Us" },
    { value: "500K+", label: "Employees Managed" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      icon: Users,
      title: "People First",
      description: "We believe great HR starts with putting people at the center of everything we do."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We're committed to delivering the highest quality solutions and services."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "We continuously evolve our platform to meet the changing needs of modern workplaces."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We operate with transparency, honesty, and respect in all our relationships."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">
            About Our Company
          </h1>
          <p className="text-xl text-white/80 mb-8">
            We're on a mission to transform how companies manage their most valuable asset - their people.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                Founded in 2020, our HRMS platform was born out of frustration with outdated, 
                complex HR systems that made simple tasks unnecessarily difficult. Our founders, 
                having worked in various industries, recognized the need for a modern, intuitive 
                solution that could adapt to the evolving workplace.
              </p>
              <p className="mb-6">
                Today, we serve over 10,000 companies worldwide, from startups to enterprise 
                organizations. Our platform has processed millions of hours of employee time, 
                managed countless payroll cycles, and helped HR teams focus on what matters most: 
                their people.
              </p>
              <p>
                We're proud to be at the forefront of HR technology, continuously innovating to 
                meet the changing needs of modern workplaces and helping organizations create 
                better employee experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-card border-0 shadow-lg">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;