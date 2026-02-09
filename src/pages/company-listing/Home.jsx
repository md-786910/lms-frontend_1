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
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";
import featureImage from "../../assets/images/general.png";
import decisionImage from "../../assets/images/managers-decision-making.png";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Comprehensive employee database with profiles, roles, and departments.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Accurate clock in/out system with automated timesheet generation.",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Real-time insights and reports that help leaders stay ahead of trends.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade controls, audit trails, and GDPR-ready privacy.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: ClipboardCheck,
    title: "Leave Management",
    description: "Automate leave requests, approvals, and tracking in real time.",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: Globe,
    title: "Global Payroll",
    description: "Streamline payroll for hybrid teams with multi-currency support.",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: Zap,
    title: "Automation Engine",
    description: "Create custom workflows that automate repetitive HR tasks.",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",    
  },
  {
    icon: Sparkles,
    title: "Mobile Experience",
    description: "Empower managers and employees with a seamless mobile app.",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",     
  },
  {
    icon: CheckCircle,
    title: "Audit-Ready Reporting",
    description: "Generate compliance reports and maintain a complete audit trail.",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",         
  },
  {
    icon: Repeat,
    title: "Scalable Architecture",
    description: "Built to grow with your organization without adding manual work.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",           
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "Stay compliant with local labor laws and regulations worldwide.",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",   
  }
]; 


const benefits = [
  "Customise the leave function to match company policies.",
  "Manage advanced leave requirements.",
  "Automatically monitor the sick leave rule.",
  "Automatically track leave balances.",
  "Set up advanced rules, e.g., long-service leave policies.",
  "Include all leave types that comply with employment laws.",
  "Set up additional leave types, such as study leave.",
  "Access system anywhere, anytime, from the PC, smartphone, or tablet.",
];
const decisions = [
  "Plan to avoid staff shortages.",
  "Immediate approval or decline of leave.",
  "The updated leave is synced with payroll.",
  "Line managers can access all leave management reports via ESS.",
]

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
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Globe,
    title: "Operate",
    description: "Automate approvals, manage payroll, and keep leadership informed.",
    iconBg: "bg-red-100",
    iconColor: "text-red-600", 
  },
  {
    icon: Repeat,
    title: "Scale",
    description: "Grow with new offices and roles without adding manual work.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
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
      <section className="relative overflow-hidden bg-[#222875] pb-20 pt-40 px-4 h-[100vh] curved-section shell-sky section-animate min-h-screen flex items-center ">
        <div className="absolute -top-44 right-[-100px] w-80 h-80 rounded-[90px] bg-white/10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-[140px] bg-white/5" />
        <div className="absolute top-1/4 left-96 w-60 h-60 rounded-[90px] bg-white/10 z-0" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 z-10">
          <div className="space-y-6">
            <div className="rounded-full bg-[#FFFFFF1A] px-4 py-2 text-xs uppercase tracking-[0.4em] text-[#CBEFFF] inline">
              Human-first HRMS
            </div>
            <h1 className="text-6xl font-bold text-[#CEBFFF] leading-tight md:text-7xl tracking-[0.01em] pb-2">
              Smart leave tracking, faster approvals, and complete control—on one secure platform.
            </h1>
            <p className="text-xl text-[#CEBFFF] tracking-[0.1em] pb-2">
              Manage employee leave effortlessly with a centralized system that automates requests, approvals, and tracking in real time. Eliminate manual processes, reduce errors, and stay compliant with company policies while giving employees and managers full visibility and control over leave data—all in one secure, easy-to-use platform.
            </p>
            <div className="flex flex-wrap gap-4 pb-5">
              <Link to="/company/get-started">
                <Button size="lg" className="bg-white hover:text-[#CBEFFF] text-primary py-8 text-lg">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Start free for 30 days
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button size="lg" variant="outline" className="bg-[#FFFFFFF1A] text-white border-white/50 py-8 text-lg hvoer:text-[#222875]">
                  Schedule a demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#CBEFFF]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-[#CBEFFF]">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
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

      <section className="py-20 px-4 max-w-[1580px] mx-auto ">
        <div className="space-y-6 text-center mb-20">
          <p className="text-lg text-[#222875] font-bold uppercase tracking-[0.5em]">Why choose us</p>
          <h2 className="text-3xl font-bold text-[#222875] tracking-[0.01em]">Everything your People Team needs</h2>
          <p className="text-gray-600 text-lg tracking-[0.1em]">
            Automate repetitive work, create beautiful employee journeys, and keep everyone safe with auditable, policy-driven workflows.
          </p>
        </div>
        <div className=" grid gap-20 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-gradient-card w-[390px] h-auto bg-gradient-card p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
              <CardHeader className="pb-2">
                {/* Icon Wrapper */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 ${feature.iconBg}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <CardTitle className="mt-4 text-xl text-[#222875] pb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <div>
                <Button variant="outline" size="sm" className="mt-4 text-sm border-primary text-primary hover:bg-primary/10">
                  Learn more
                  <ArrowRight className="h-4 w-4 text-[#222875]" />
                </Button> 
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-row-1 md:grid-row-2 gap-20 py-20 px-4 bg-gradient-to-bl from-[#F5FBFF] via-[#CBEFFF] to-[#EAF7FF] h-[100vh] curved-section shell-sky section-animate">
        <div className="max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 items-center">
          <div className="rounded-2xl bg-black/10 p-8 shadow-xl">
            <img src={featureImage} alt="feature iamges" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#222875] leading-tight tracking-[0.1em]">Intuitive Features</h2>
            <p className="text-[#131313] text-xl leading-tight tracking-[0.1em]">
              Intuitive features designed to simplify leave management for everyone—from employees to HR teams. Each tool is thoughtfully built to reduce manual work, speed up approvals, and deliver complete visibility, so your organization runs smoother every day.
            </p>
            <div className="space-y-3 pt-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2D5356]" />
                  <span className="text-[#131313]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#222875] leading-tight tracking-[0.1em]">Managers’ Decision Making</h2>
            <p className="text-[#131313] text-xl leading-tight tracking-[0.1em]">
              Managers can easily see who will be away, enabling them to make swift, smart decisions and avoid potential scheduling conflicts. Leave management is automated email sent to relevant manager and the employee to confirm the leave status.
            </p>
            <div className="space-y-3 pt-5">
              {decisions.map((decision) => (
                <div key={decision} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2D5356]" />
                  <span className="text-[#131313]">{decision}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-black/10 p-8 shadow-xl">
            <img src={decisionImage} alt="decision Image" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-[1580px] mx-auto">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-lg font-bold text-[#222875] uppercase tracking-[0.5em]">How it works</p>
          <h2 className="text-3xl font-bold text-[#222875]">Go live in three simple steps</h2>
          <p className="text-[#131313] text-lg leading-tight tracking-[0.1em]">
            We give you a partner, a detailed rollout plan, and the confidence to launch with the same tools we build every day.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journey.map((item, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-primary ${item.iconBg}`}>
                <item.icon className={`h-6 w-6 ${item.iconColor}`}/>
              </div>
              <h3 className="text-lg font-semibold text-[#222875]">{item.title}</h3>
              <p className="text-sm text-[#131313]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-20 px-4 bg-[#222875]">
        <div className="absolute top-24 -left-20 w-48 h-48 rounded-[140px] bg-white/20" />
        <div className="absolute bottom-24 -right-20 w-48 h-48 rounded-[140px] bg-white/20" />
        <div className="max-w-[1580px] mx-auto">
          {/* Stats Row - Moved Below */}
          <div className="flex flex-wrap justify-center lg:justify-center gap-20 reveal stagger-5">
            <div className="text-center lg:text-left">
              <div className="text-4xl font-black text-[#CBEFFF] mb-1">10K+</div>
              <div className="text-sm text-[#FFFCF3] font-medium">Projects Managed</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-black text-[#CBEFFF] mb-1">500+</div>
              <div className="text-sm text-[#FFFCF3] font-medium">Happy Teams</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-black text-[#CBEFFF] mb-1">99.9%</div>
              <div className="text-sm text-[#FFFCF3] font-medium">Uptime</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl font-black text-[#CBEFFF] mb-1">4.9<span class="text-yellow-500">★</span></div>
              <div className="text-sm text-[#FFFCF3] font-medium">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-[#222875]">Tackle HR complexity with clarity</h2>
          <p className="text-[#131313] text-lg leading-tight tracking-[0.1em]">
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
      </section>

      <LandingFooter />
    </div>
  );
};

export default Home;
