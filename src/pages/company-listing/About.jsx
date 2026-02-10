import { Button } from "@/components/ui/button";
import ScrollRevealSection from "@/components/landing/ScrollRevealSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { ArrowRight, ShieldCheck, Globe, Sparkles, Users, HeartHandshake, Star, Target } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "10,000+", label: "Companies Trust Us" },
  { value: "500K+", label: "Employees Managed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Expert Support" },
];

const coreFeatures = [
  {
    title: "Unified Learning Journeys",
    description:
      "Sequence onboarding, compliance, and professional growth programs in one place, delivering clarity for every learner.",
    icon: Globe,
  },
  {
    title: "Intelligent Content Hub",
    description:
      "Curate microlearning, webinars, and certifications with guided paths, so every role has a tailored roadmap.",
    icon: Sparkles,
  },
  {
    title: "Insights & Analytics",
    description:
      "Measure engagement, completion, and impact with dashboards that tie learning to performance goals.",
    icon: ShieldCheck,
  },
  {
    title: "Automation & Workflows",
    description:
      "Trigger reminders, approvals, and progress nudges that keep learners and managers aligned.",
    icon: ArrowRight,
  },
];

const reasons = [
  "Modern, mobile-first interface built for learners and admins.",
  "Dedicated success partners and pro services to accelerate rollout.",
  "Enterprise-ready compliance, security, and governance controls.",
  "Seamless integrations with HRIS, payroll, and collaboration tools.",
];

const values = [
  {
    title: "People First",
    description: "Every update is hardened through empathy, testing, and human-centered research.",
    icon: Users,
  },
  {
    title: "Bold Innovation",
    description: "We anticipate modern work challenges and ship thoughtful improvements constantly.",
    icon: Star,
  },
  {
    title: "Trusted Partnership",
    description: "We act as an extension of your people team with transparent communication.",
    icon: HeartHandshake,
  },
  {
    title: "Purposeful Impact",
    description: "Learning should drive business results, so we obsess over measurable outcomes.",
    icon: Target,
  },
];

const About = () => {
  return (
    <div className="text-white">
      <ScrollRevealSection
        className="relative overflow-hidden bg-[#222875] px-4 pb-28 pt-24"
        delay={0}
        threshold={0.3}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-10 left-10 h-36 w-36 rounded-[120px] bg-[#CBEFFF]/20 blur-3xl" />
          <div className="absolute bottom-0 right-6 h-40 w-40 rounded-[140px] bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1580px] gap-8">
          <div className="inline rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.5em] text-[#CBEFFF]">
            Learning, reimagined
          </div>
          <div className="mt-10 flex flex-col items-center gap-6 text-center">
            <h1 className="text-7xl font-semibold leading-tight text-white md:text-5xl lg:text-8xl mb-3" > 
              A forward-facing LMS that keeps learning human.
            </h1>
            <p className="text-xl text-[#CBEFFF] md:text-2xl">
              A next-generation LMS that fuses storytelling, automation, and data intelligence—empowering teams to launch skills faster, track progress smarter, and evolve learning without limits.
From onboarding to advanced certifications, every learning journey is structured, measurable, and human-centric. Powerful insights turn engagement into action, while flexible workflows ensure learning adapts as your organization grows.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-5">
              <Link to="/company/get-started">
                <Button className="bg-[#CBEFFF] text-[#222875] hover:text-[#CBEFFF] hover:bg-[#1F2F63] px-10 py-4 rounded-xl hover:border hover:boter-[#CBEFFF] transition-all duration-200 ease-in-out hover:shadow-sm  shadow-[#273C7D]/10" size="xl">
                  Launch a pilot
                </Button>
              </Link>
              <Link to="/company/contact">
                <Button variant="outline" className="bg-[#222875] text-[#CBEFFF] hover:text-[#222785] hover:bg-[#FFFFFF] px-10 py-4 rounded-xl border boter-[#CBEFFF] hover:border-none transition-all duration-200 ease-in-out hover:shadow-sm  shadow-[#273C7D]/10" size="xl">
                  Talk with our team
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 pt-8 text-left md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/5 p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#CBEFFF]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection className="px-4 py-20" delay={120} threshold={0.25}>
        <div className="mx-auto max-w-[1580px] space-y-10 text-center">
          <p className="text-md font-bold uppercase tracking-[0.4em] text-[#131313]">About the platform</p>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-[#222785]">Designed for the pace of modern work</h2>
            <p className="text-[#131313]/90 text-xl tracking-[0.1em]">
              From onboarding to compliance and leadership development, every experience is shaped by clarity, trust, and delightful transitions. Content is organized by themes, nudged into action with smart automations, and measured end-to-end.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-left backdrop-blur">
              <h3 className="text-md font-semibold text-[#222875]">Mission & Vision</h3>
              <p className="mt-3 text-[#131313]/90 text-lg">
                Mission: Give every learner the tools to master their craft while empowering people teams with the data and workflows they need to lead confidently.
              </p>
              <p className="mt-3 text-[#131313]/90 text-lg">
                Vision: A world where learning is simple, inspiring, and measurable across every stage of the employee journey.
              </p>
            </div>
            <div className="rounded-3xl border border-[#CBEFFF]/30 bg-[#CBEFFF]/10 p-6 text-left shadow-2xl">
              <h3 className="text-xl font-semibold text-[#222875]">How we stay ahead</h3>
              <ul className="mt-4 space-y-3 text-[#131313]/90 text-lg">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3 text-lg">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#222785]" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection className="px-4 pb-20" delay={200} threshold={0.3}>
        <div className="mx-auto max-w-[1580px]">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-lg font-bold uppercase tracking-[0.4em] text-[#131313] pb-5">Core LMS Features</p>
            <h2 className="text-4xl font-semibold text-[#222785] pb-2">Everything your people team needs to move fast</h2>
            <p className="text-[#131313]/90 text-xl tracking-[0.1em]">
              We blended modern UX, automation, and analytics so every workflow feels premium and effortless.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {coreFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-[32px] border border-white/10 bg-white/5 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CBEFFF] text-[#222875] shadow-lg shadow-[#222875]/40">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-[#222875]">{feature.title}</h3>
                <p className="mt-3 text-[#131313]/90 trackin-[0.1em] text-lg">{feature.description}</p>
                <div className="mt-4 flex items-center text-sm text-[#222785] font-medium group-hover:text-[#1b26be] cursor-pointer transition-colors duration-300">
                  More about {feature.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </ScrollRevealSection>
      <div className="mb-20 bg-gradient-to-bl from-[#F5FBFF] via-[#CBEFFF] to-[#EAF7FF] curved-section shell-sky section-animate">
        <ScrollRevealSection className="px-4 py-20" delay={260} threshold={0.3}>
          <div className="mx-auto max-w-[1580px]">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-md font-bold uppercase tracking-[0.4em] text-[#131313]">Why choose us</p>
              <h2 className="text-3xl font-semibold text-[#222785]">A partner that keeps learning clear and consistent</h2>
              <p className="text-[#131313]/80 text-xl tracking-[0.1em]">
                Every release is guided by learner feedback, accessibility best practices, and measurable business results.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label + "-why"}
                  className="rounded-3xl border border-white/15 bg-white/5 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1"
                >
                  <p className="text-xl font-semibold tracking-[0.1em] text-[#222785]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#131313]">{stat.value}</p>
                  <p className="mt-2 text-xs text-[#222875]">{stat.label} embedded in every interaction.</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollRevealSection>
      </div>
      <ScrollRevealSection className="px-4 pb-24" delay={320} threshold={0.3}>
        <div className="mx-auto max-w-[1580px] space-y-10">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-md font-bold uppercase tracking-[0.4em] text-[#131313]">Our values</p>
            <h2 className="text-4xl font-semibold text-[#222875]">Values that power every release</h2>
            <p className="text-[#131313]/80 tracking-[0.1em] text-xl">We pair high standards with empathy to move people, not just processes.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-[28px] border border-[#222785]/30 bg-white/5 p-6 transition duration-300 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CBEFFF] text-[#5c9db9]">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-[#222875]">{value.title}</h3>
                <p className="mt-2 text-[#131313]/80">{value.description}</p>
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
      </ScrollRevealSection>

      <LandingFooter />
    </div>
  );
};

export default About;
