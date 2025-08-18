import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6 text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Choose the plan that fits your organization's needs. No hidden fees,
            no surprises.
          </p>
          <Badge className="mb-4 bg-white text-primary hover:bg-white/90">
            14-day free trial • No credit card required
          </Badge>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-xl transition-all duration-300 bg-gradient-card border-0 shadow-lg ${
                  plan.popular ? "ring-2 ring-primary transform scale-105" : ""
                }  `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/company/get-started" className="block">
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
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
      <section className="py-20 px-4 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-white">
            All Plans Include
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-xl">
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
                  className="flex items-center gap-3 justify-center"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-background"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white p-12 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of companies already streamlining their HR with our
              platform.
            </p>
            <Link to="/company/get-started">
              <Button size="lg" className="px-8 bg-primary">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
