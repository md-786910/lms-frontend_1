import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";

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

  return (
    <div className="landing-shell min-h-screen">
      {/* Hero Section */}
      <section className="landing-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-black"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[#0f172a]">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[#0f172a]/70">
            Choose the plan that fits your organization's needs. No hidden fees,
            no surprises.
          </p>
          <Badge className="mb-4 bg-white text-[#0f172a] hover:bg-white/90">
            14-day free trial • No credit card required
          </Badge>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`landing-panel relative transition-all duration-300 border-0 ${
                  plan.popular ? "ring-2 ring-[#CDE7FF] scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-white text-[#0f172a] px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-2xl text-[#0f172a]">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#0f172a]">
                      {plan.price}
                    </span>
                    <span className="text-[#0f172a]/70 ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-[#0f172a]/70 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-[#0f172a]/70"
                      >
                        <CheckCircle className="h-5 w-5 text-[#0f172a]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/company/get-started" className="block">
                    <Button className="w-full bg-[#EAF7FF] text-[#0f172a]">
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Start Free Trial"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0f172a]">
              All Plans Include
            </h2>
          </div>
          <div className="landing-panel p-8 rounded-xl border-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "SSL Security",
                "Data Backup",
                "Mobile Access",
                "Email Support",
                "Regular Updates",
                "GDPR Compliance",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 justify-center text-[#0f172a]/70"
                >
                  <CheckCircle className="h-5 w-5 text-[#0f172a]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="landing-section py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {pricingHighlights.map((highlight) => (
            <div key={highlight.title} className="landing-panel p-6 rounded-2xl border-white/20 space-y-3">
              <h3 className="text-xl font-semibold text-[#0f172a]">{highlight.title}</h3>
              <p className="text-[#0f172a]/70 text-sm">{highlight.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[#0f172a]/70 text-lg">
              Got questions? We've got answers.
            </p>
          </div>
          <div className="landing-panel p-8 rounded-xl border-0">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-[#0f172a] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-[#0f172a]/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="landing-panel p-12 rounded-xl border-0 text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[#0f172a]/70 mb-8">
              Join thousands of companies already streamlining their HR with our
              platform.
            </p>
            <Link to="/company/get-started">
              <Button size="lg" className="px-8 bg-[#EAF7FF] text-[#0f172a]">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export default Pricing;
