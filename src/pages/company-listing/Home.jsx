import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ClipboardCheck,
  Clock,
  Globe,
  Repeat,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Comprehensive employee database with profiles, roles, and departments.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Accurate clock in/out system with automated timesheet generation.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Real-time insights and reports that help leaders stay ahead of trends.",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade controls, audit trails, and GDPR-ready privacy.",
  },
];

const benefits = [
  "Reduce HR workload by 80%",
  "Improve employee satisfaction",
  "Automate payroll processing",
  "Real-time attendance tracking",
  "Generate compliance reports",
  "Mobile-first experience",
];

const stats = [
  { value: "1,200+", label: "Global teams onboarded" },
  { value: "99.9%", label: "Uptime & reliability" },
  { value: "45 hrs", label: "Average HR admin time saved per week" },
];

const journey = [
  {
    icon: ClipboardCheck,
    title: "Launch",
    description: "Define workflows, invite teams, and migrate essential data in days.",
  },
  {
    icon: Globe,
    title: "Operate",
    description: "Automate approvals, manage payroll, and keep leadership informed.",
  },
  {
    icon: Repeat,
    title: "Scale",
    description: "Grow with new offices and roles without adding manual work.",
  },
];

const testimonials = [
  {
    quote:
      "The platform feels like it was purpose-built for our operations. We gained visibility into attendance, payroll, and reviews in under a month.",
    name: "Maya Gonzalez",
    role: "VP of People, Northwind Logistics",
  },
  {
    quote:
      "Automated compliance reporting let us move faster while staying audit-ready. The mobile experience keeps every manager aligned.",
    name: "Eric Park",
    role: "HR Director, Forge Labs",
  },
];

const trustedLogos = ["Fortune 500", "Global Retail", "HealthTech", "Enterprise Finance"];

const Home = () => {
  return (
    <div className="bg-gradient-background text-white">
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/80">
              Human-first HRMS
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Empower your people, automate operations, and keep compliance in check.
            </h1>
            <p className="text-lg text-white/80">
              PulseHR brings together onboarding, time tracking, payroll, and
              performance under a single, delightful experience for your entire
              organisation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/company/get-started">
                <Button size="lg" className="bg-white text-primary">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Start free for 30 days
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button size="lg" variant="outline" className="text-white border-white/50">
                  Schedule a demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/70">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Trusted by</span>
              <span className="text-white/80">500+ companies</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
              {trustedLogos.map((logo) => (
                <div key={logo} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center">
                  {logo}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Sparkles className="h-5 w-5" />
              <p>Optimised for hybrid teams and global payroll.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live support</p>
              <p className="text-lg font-semibold mt-2">Response in under 2 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          <p className="text-sm text-primary uppercase tracking-[0.5em]">Why choose us</p>
          <h2 className="text-3xl font-bold">Everything your People Team needs</h2>
          <p className="text-muted-foreground">
            Automate repetitive work, create beautiful employee journeys, and keep everyone safe with auditable, policy-driven workflows.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-gradient-card p-6 shadow-xl">
              <CardHeader className="pb-2">
                <feature.icon className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4 text-lg text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-primary">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Transform your HR operations</h2>
            <p className="text-white/80 text-lg">
              Join thousands of organizations that are replacing fragmented HR tools with a single, intelligent platform.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-white">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-black/50 p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-white">Ready to get started?</h3>
            <p className="text-white/70 mt-3">
              Start your free trial today and see the difference smart automation makes for your people team.
            </p>
            <Link to="/company/get-started">
              <Button className="mt-6 w-full bg-white text-primary" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-sm text-primary uppercase tracking-[0.5em]">How it works</p>
          <h2 className="text-3xl font-bold">Go live in three simple steps</h2>
          <p className="text-muted-foreground">
            We give you a partner, a detailed rollout plan, and the confidence to launch with the same tools we build every day.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journey.map((item, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-4 rounded-3xl bg-white/5 p-8">
              <p className="text-lg text-white/80">&quot;{testimonial.quote}&quot;</p>
              <p className="text-white font-semibold">{testimonial.name}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Tackle HR complexity with clarity</h2>
          <p className="text-muted-foreground">
            Our flexible platform adapts to your policies, payroll, and processes. Ready to lead with confidence?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/company/get-started">
              <Button size="lg" className="bg-primary text-white">
                Launch a pilot
              </Button>
            </Link>
            <Link to="/company/contact">
              <Button size="lg" variant="outline" className="border border-primary text-primary">
                Talk with sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Home;
