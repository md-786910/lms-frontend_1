import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";
import ScrollRevealSection from "@/components/landing/ScrollRevealSection";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "per employee/month",
      description:
        "Perfect for small businesses getting started with HR management",
      features: [
        "Up to 50 employees",
        "Employee management",
        "Basic time tracking",
        "Leave management",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
      btn_text: "Get Started",
    },
    {
      name: "Professional",
      price: "$10",
      period: "per employee/month",
      description: "Ideal for growing companies with advanced HR needs",
      features: [
        "Up to 500 employees",
        "All Starter features",
        "Advanced analytics",
        "Payroll management",
        "Performance tracking",
        "API access",
        "Priority support",
        "Custom reports",
      ],
      popular: true,
      btn_text: "start free trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description:
        "Tailored solutions for large organizations with complex requirements",
      features: [
        "Unlimited employees",
        "All Professional features",
        "Custom integrations",
        "Advanced security",
        "Dedicated support",
        "On-premise deployment",
        "Custom workflows",
        "SLA guarantee",
      ],
      popular: false,
      btn_text: "Contact Sales",
    },
  ];

const faqs = [
    {
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features.",
    },
    {
      question: "Can I change plans anytime?",
      answer: "Absolutely. You can upgrade or downgrade your plan at any time.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards and bank transfers for annual plans.",
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees. You only pay for the plan you choose.",
    },
];

const pricingHighlights = [
  {
    title: "Global readiness",
    detail: "Multi-currency payroll + compliance reports that ship with every plan.",
  },
  {
    title: "Risk-free rollout",
    detail: "14-day free trial and guided onboarding keep your launch safe and predictable.",
  },
  {
    title: "Dedicated success",
    detail: "Priority support, integrations, and update notes for every company on Professional and above.",
  },
];

const faqData = [
  {
    question: "How does the Leave Management System work?",
    answer:
      "Employees can easily apply for leave, managers can review and approve requests in real time, and HR teams get complete visibility into balances, policies, and leave trends—all from a single platform."
  },
  {
    question: "Can I customize leave policies for different teams?",
    answer:
      "Yes. You can create flexible leave policies based on roles, departments, locations, or employment types, ensuring accurate tracking and compliance."
  },
  {
    question: "Does the system support multiple leave types?",
    answer:
      "Absolutely. The platform supports paid leave, sick leave, casual leave, comp-off, holidays, and custom leave types tailored to your organization."
  },
  {
    question: "Is employee leave data secure?",
    answer:
      "Yes. We follow industry-standard security practices to protect employee data, ensuring privacy, reliability, and compliance."
  },
  {
    question: "Can managers see team availability in real time?",
    answer:
      "Managers get a real-time view of team availability, helping them plan workloads and avoid scheduling conflicts."
  }
];


  return (
    <div className="landing-shell min-h-screen">
    {/* ------------------ HERO SECTION ------------------ */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-gradient-to-br from-[#CBEFFF]/70 via-white to-white">
        <div className="max-w-[1580px] mx-auto space-y-6">
          <h1 className="landing-h1 landing-h2-dark">
            Predictable Pricing Built for Modern HR Teams
          </h1>
          <p className="landing-body landing-body-dark max-w-2xl mx-auto">
            Automate leave tracking, approvals, and compliance with transparent
            pricing that scales as your organization grows.
          </p>
        <Badge className="bg-white text-[#0f172a] px-5 py-2 rounded-full shadow text-md">
          14-day free trial • No credit card required
        </Badge>
      </div>
    </section>

    {/* ------------------ PRICING PLANS ------------------ */}
    <section className="py-24 px-4 bg-white">
      <div className="max-w-[1580px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg 
              transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
              ${plan.popular ? "ring-2 ring-[#4DA3FF] scale-[1.03]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#4DA3FF] text-white px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Best for Growing Teams
                  </Badge>
                </div>
              )}

                <CardHeader className="text-center space-y-4 pt-10">
                  <CardTitle className="landing-h3 landing-h2-dark">
                    {plan.name}
                  </CardTitle>
            
                <div>
                  <span className="text-4xl font-bold text-[#0f172a]">
                    {plan.price}
                  </span>
                  <span className="text-[#0f172a]/60 ml-1">
                    {plan.period}
                  </span>
                </div>
            
                <p className="landing-body landing-body-dark px-4">
                  {plan.description}
                </p>
              </CardHeader>
            
              <CardContent className="pt-2">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                    className="flex items-start gap-3 landing-card-text"
                    >
                      <CheckCircle className="h-5 w-5 text-[#4DA3FF] mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/company/get-started" className="block">
                  <Button
                    className={`w-full rounded-xl text-sm font-medium transition-all
                    ${
                      plan.popular
                        ? "bg-[#4DA3FF] text-white hover:bg-[#358DEB]"
                        : "bg-[#0f172a] text-white hover:bg-[#0f172a]/90"
                    }`}
                  >
                    {plan.name === "Enterprise"
                      ? "Talk to Sales"
                      : "Start Free – 14 Days"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
        
    {/* ------------------ ALL PLANS INCLUDE ------------------ */}
    <section className="py-24 px-4 bg-[#F8FBFF]">
      <div className="max-w-[1580px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="landing-h2 landing-h2-dark">
            Enterprise-Grade Standards, Included
          </h2>
          <p className="landing-body landing-body-dark mt-2">
            Security, reliability, and compliance—built into every plan.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-10 shadow-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Role-Based Access Control",
              "Audit-Ready Leave Records",
              "Secure Cloud Backup",
              "Mobile-Friendly HR Dashboard",
              "Compliance-Ready Architecture",
              "Continuous Feature Updates",
            ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 landing-card-text"
                >
                <CheckCircle className="h-5 w-5 text-[#4DA3FF]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
          
    {/* ------------------ PRICING HIGHLIGHTS ------------------ */}
    <section className="py-20 px-4 bg-white">
          <div className="max-w-[1580px] mx-auto grid md:grid-cols-3 gap-6">
        {pricingHighlights.map((highlight) => (
          <div
            key={highlight.title}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
          >
            <h3 className="landing-h3 text-[#222785]">
              {highlight.title}
            </h3>
            <p className="landing-body landing-body-dark mt-2">
              {highlight.detail}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ Section */}
    <section className="relative py-28 px-4">
      <div className="max-w-[1100px] mx-auto space-y-16">

        {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
          <p className="text-[#131313] font-bold mb-3">
            FAQs
          </p>
          <h2 className="landing-h2 landing-h2-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="landing-body landing-body-dark">
            Everything you need to know about how our Leave Management System works.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <details
              key={index}
              className="
                group bg-white rounded-2xl p-6
                border border-[#222875]/10
                shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                transition-all
              "
            >
              <summary className="
                flex cursor-pointer items-center justify-between
                list-none text-3xl text-[#222785]
              ">
                {faq.question}
                <span className="
                  ml-4 flex h-8 w-8 items-center justify-center
                  rounded-full bg-[#CBEFFF]
                  group-open:rotate-45 transition-transform
                ">
                  +
                </span>
              </summary>
         
              <p className="landing-body landing-body-dark mt-4 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center pt-10">
          <p className="text-[#0f172a]/70 mb-4">
            Still have questions?
          </p>
          <a
            href="/company/contact"
            className="
              inline-flex items-center justify-center
              px-8 py-4 rounded-xl
              bg-[#222875] text-white
              hover:bg-[#1b1f6b] transition
            "
          >
            Talk to our team
          </a>
        </div>
        
      </div>
    </section>


      {/* CTA Section */}
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

export default Pricing;
