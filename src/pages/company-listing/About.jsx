import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Globe, Heart } from "lucide-react";
import LandingFooter from "@/components/landing/LandingFooter";


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

const impactHighlights = [
  {
    metric: "45%",
    label: "faster approvals",
    description:
      "Automated routing and reminders keep leave requests moving so teams stay productive.",
  },
  {
    metric: "24/7",
    label: "confidence",
    description:
      "Real-time dashboards and audit trails give leadership the visibility they need any time.",
  },
  {
    metric: "98%",
    label: "accuracy",
    description:
      "Built-in compliance rules and payroll feeds reduce manual errors across global offices.",
  },
];

  return (
    <div className="landing-shell min-h-screen">
      {/* Hero Section */}
      <section className="landing-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-black"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[#0f172a] tracking-[0.08em]">
            About Our Company
          </h1>
          <p className="text-xl text-[#0f172a]/70">
            We're on a mission to transform how companies manage their most valuable asset – their people.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-section py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="landing-panel text-center rounded-2xl p-6 border-white/20"
              >
                <div className="text-3xl font-bold text-[#0f172a] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#0f172a]/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Our Story</h2>
          </div>
          <div className="landing-panel p-8 rounded-xl">
            <div className="prose prose-lg max-w-none text-[#0f172a]/70">
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

      {/* Impact Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.5em] text-[#0f172a]/60">
              Impact Delivered
            </p>
            <h2 className="text-3xl font-bold text-[#0f172a]">
              Designed for people teams who demand speed and trust
            </h2>
            <p className="text-[#0f172a]/70">
              PulseHR aligns every policy, leave request, and approval with the way your organization actually works. Get intelligence, guardrails, and automation that grows with your workforce.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {impactHighlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="landing-panel p-5 rounded-2xl text-center border-white/30"
                >
                  <div className="text-3xl font-black text-[#0f172a]">
                    {highlight.metric}
                  </div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#0f172a]/60">
                    {highlight.label}
                  </p>
                  <p className="text-[#0f172a]/70 mt-2 text-sm">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="landing-panel p-8 rounded-3xl border-white/20 space-y-4">
            <h3 className="text-xl font-semibold text-[#0f172a]">
              What our platform coordinates
            </h3>
            <ul className="space-y-3 text-[#0f172a]/70">
              <li>Cross-team leave approvals, escalated in seconds</li>
              <li>Always-on analytics that flag capacity and burnout risks</li>
              <li>Payroll sync and audit exports ready in a single click</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Our Values</h2>
            <p className="text-[#0f172a]/70 text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="landing-panel text-center hover:shadow-xl transition-all duration-300 border-0"
              >
                <CardHeader className="space-y-2">
                  <value.icon className="h-12 w-12 text-[#0f172a] mx-auto mb-2" />
                  <CardTitle className="text-[#0f172a]">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0f172a]/70">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default About;
