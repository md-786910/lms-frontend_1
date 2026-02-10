import { useEffect, useRef, useState } from "react";
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
import ScrollRevealSection from "@/components/landing/ScrollRevealSection";
import featureImage from "../../assets/images/general.png";
import decisionImage from "../../assets/images/managers-decision-making.png";
import HeroImage from "../../assets/images/heroImage.png";

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
  {
    target: 10,
    label: "Projects Managed",
    formatter: (value) => `${Math.round(value)}K+`,
  },
  {
    target: 500,
    label: "Happy Teams",
    formatter: (value) => `${Math.round(value)}+`,
  },
  {
    target: 99.9,
    label: "Uptime",
    formatter: (value) => `${value.toFixed(1)}%`,
  },
  {
    target: 4.9,
    label: "User Rating",
    formatter: (value) => (
      <span className="flex items-center gap-1">
        <span>{value.toFixed(1)}</span>
        <span className="text-yellow-400">★</span>
      </span>
    ),
  },
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
  const statsRef = useRef(null);
  const [animatedValues, setAnimatedValues] = useState(
    stats.map(() => 0),
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasAnimated(true);
          observer.disconnect();
          const startTime = performance.now();
          const duration = 1200;

          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setAnimatedValues(
              stats.map((stat) => stat.target * progress),
            );

            if (progress < 1) {
              window.requestAnimationFrame(animate);
            }
          };

          window.requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);
  return (
    <div className="landing-shell bg-gradient-background text-white">
      <ScrollRevealSection
        className="relative overflow-hidden bg-[#222875] pb-20 pt-40 px-4 h-[100vh] curved-section shell-sky section-animate min-h-screen flex items-center "
        threshold={0.3}
        delay={0}
      >
        <div className="absolute -top-44 right-[-100px] w-80 h-80 rounded-[90px] bg-white/10" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-[140px] bg-white/5" />
          <div className="absolute top-1/4 left-96 w-60 h-60 rounded-[90px] bg-white/10 z-0" />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 z-10">
            <div className="space-y-6">
              <div className="rounded-full bg-[#FFFFFF1A] px-4 py-2 text-xs uppercase tracking-[0.4em] text-[#CBEFFF] inline">
                Human-first HRMS
              </div>
              <h1 className="landing-h1 pb-2">
                Smart leave tracking, faster approvals, and complete control—on one secure platform.
              </h1>
              <p className="landing-body pb-2">
                Manage employee leave effortlessly with a centralized system that automates requests, approvals, and tracking in real time. Eliminate manual processes, reduce errors, and stay compliant with company policies while giving employees and managers full visibility and control over leave data—all in one secure, easy-to-use platform.
              </p>
              <div className="flex flex-wrap gap-4 pb-5 justify-center">
                <Link to="/company/get-started">
                  <Button size="lg" className="btn-glow px-8 py-5 font-semibold text-[#222785]">
                    <Zap className="mr-2 h-5 w-5 text-[#222875]" />
                    Start free for 30 days
                  </Button>
                </Link>
                <Link to="/company/contact">
                  <Button size="lg" variant="outline" className="border border-white/40 text-[#131313] px-8 py-5 hover:border-white/60">
                    Schedule a demo
                  </Button>
                </Link>
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
      </ScrollRevealSection>

      <ScrollRevealSection
        className="py-20 px-4 max-w-[1580px] mx-auto "
        delay={120}
        threshold={0.2}
      >
        <div className="space-y-6 text-center mb-20">
          <p className="text-[#131313] font-bold">Why choose us</p>
          <h2 className="landing-h2 landing-h2-dark">Everything your People Team needs</h2>
          <p className="landing-body landing-body-dark">
            Automate repetitive work, create beautiful employee journeys, and keep everyone safe with auditable, policy-driven workflows.
          </p>
        </div>
        <div className=" grid gap-20 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <ScrollRevealSection
              delay={120}
              threshold={0.2}
            >
              <Card key={index} className="interactive-card w-[390px] h-auto bg-gradient-card p-6">
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
            </ScrollRevealSection>
          ))}
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        className="grid grid-row-1 md:grid-row-2 gap-20 py-20 px-4 bg-gradient-to-bl from-[#F5FBFF] via-[#CBEFFF] to-[#EAF7FF] h-[100vh] curved-section shell-sky section-animate"
        delay={220}
        threshold={0.2}
      >
        <div className="max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 items-center">
          <img src={HeroImage} alt="feature iamges" />
          <div className="space-y-4">
            <h2 className="landing-h2 landing-h2-dark">Intuitive Features</h2>
            <p className="landing-body landing-body-dark">
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
        <ScrollRevealSection
          delay={220}
          threshold={0.2}
        >
          <div className="max-w-[1580px] mx-auto grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="landing-h2 landing-h2-dark">Managers’ Decision Making</h2>
              <p className="landing-body landing-body-dark">
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
            <img src={decisionImage} alt="decision Image" />
          </div>
        </ScrollRevealSection>
      </ScrollRevealSection>

      <ScrollRevealSection
        className="py-20 px-4 max-w-[1580px] mx-auto"
        delay={320}
        threshold={0.25}
      >
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-[#131313] font-bold">How it works</p>
          <h2 className="landing-h2 landing-h2-dark">Go live in three simple steps</h2>
          <p className="landing-body landing-body-dark">
            We give you a partner, a detailed rollout plan, and the confidence to launch with the same tools we build every day.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journey.map((item, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-primary ${item.iconBg}`}>
                <item.icon className={`h-6 w-6 ${item.iconColor}`}/>
              </div>
              <h3 className="landing-h3 text-[#222785]">{item.title}</h3>
              <p className="landing-card-text">{item.description}</p>
            </div>
          ))}
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        className="relative py-20 px-4 bg-[#222875]"
        delay={380}
        threshold={0.25}
      >
        <div className="absolute top-24 -left-20 w-48 h-48 rounded-[140px] bg-white/20" />
        <div className="absolute bottom-24 -right-20 w-48 h-48 rounded-[140px] bg-white/20" />
        <div className="max-w-[1580px] mx-auto">
          <div
            ref={statsRef}
            className="flex flex-wrap justify-center lg:justify-center gap-48 reveal stagger-5 max-w-[1580px] mx-auto section-animate"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-6xl font-black text-[#CBEFFF] mb-1">
                  {stat.formatter(animatedValues[index])}
                </div>
                <div className="text-xl text-[#FFFCF3] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection
        className="py-20 px-4 text-center"
        delay={440}
        threshold={0.25}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="landing-h2 landing-h2-dark">Tackle HR complexity with clarity</h2>
          <p className="landing-body landing-body-dark">
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
      </ScrollRevealSection>

      <LandingFooter />
    </div>
  );
};

export default Home;
