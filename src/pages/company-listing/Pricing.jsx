import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import MotionWrapper from "../../components/MotionWrapper";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "per user/mo",
      description: "Essential tools for small teams getting started.",
      features: [
        "Up to 50 employees",
        "Basic profile management",
        "Time tracking",
        "Leave management",
        "Community support",
      ],
      popular: false,
      btn_text: "Get Started Free",
      variant: "outline"
    },
    {
      name: "Professional",
      price: "$12",
      period: "per user/mo",
      description: "Advanced features for scaling organizations.",
      features: [
        "Up to 500 employees",
        "Everything in Starter",
        "Advanced analytics & reporting",
        "Payroll integration",
        "Performance reviews",
        "Priority email support",
      ],
      popular: true,
      btn_text: "Start 14-Day Trial",
      variant: "default"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "annual billing",
      description: "Tailored solutions for large-scale operations.",
      features: [
        "Unlimited employees",
        "Everything in Pro",
        "Custom API integrations",
        "Dedicated success manager",
        "SSO & advanced security",
        "SLA guarantees",
      ],
      popular: false,
      btn_text: "Contact Sales",
      variant: "outline"
    },
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes, you can change your plan at any time. Prorated charges will apply."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No, our standard plans are month-to-month. Annual plans offer discounts."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade encryption and are SOC2 compliant."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <MotionWrapper>
        {/* Hero Section */}
        <section className="relative py-24 px-6 text-center overflow-hidden bg-[#020817]">
           {/* Background Gradients */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -z-10" />
           
          <div className="max-w-4xl mx-auto relative z-10">
            <Badge variant="outline" className="mb-6 bg-blue-900/30 text-blue-400 border-blue-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest animate-enter">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">
              Plans that Scale with You
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transparent pricing with no hidden fees. Start small and grow as you need.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-6 -mt-20 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative flex flex-col border-2 transition-all duration-300 ${
                    plan.popular 
                      ? "border-blue-600 shadow-2xl shadow-blue-900/20 bg-[#0f172a] scale-105 z-10" 
                      : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-xl"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 h-8 text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Star className="w-3 h-3 mr-1.5 fill-current" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="p-8 pb-4">
                    <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-6 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black tracking-tight ${plan.popular ? "text-white" : "text-slate-900"}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm font-medium ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>
                        {plan.period !== "pricing" && "/mo"}
                      </span>
                    </div>
                    {plan.period !== "pricing" && (
                        <p className={`text-xs mt-1 ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>
                            Billed {plan.period}
                        </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-4 flex-1 flex flex-col">
                    <div className={`h-px w-full mb-6 ${plan.popular ? "bg-slate-800" : "bg-slate-100"}`} />
                    
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.popular ? "text-blue-500" : "text-green-600"}`} />
                          <span className={plan.popular ? "text-slate-300" : "text-slate-600"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/company/get-started" className="block mt-auto">
                      <Button 
                        size="lg" 
                        className={`w-full font-bold h-12 rounded-lg transition-all ${
                          plan.popular 
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25" 
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        {plan.btn_text}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Mini */}
        <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-12">Included in Every Plan</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                {[
                    { title: "Secure Data", desc: "256-bit SSL encryption and daily backups." },
                    { title: "Mobile Access", desc: "Full-featured iOS and Android apps." },
                    { title: "Compliance", desc: "Automated tax & labor law updates." },
                    { title: "Support", desc: "Access to our help center and community." },
                    { title: "Onboarding", desc: "Self-guided setup wizard." },
                    { title: "API Access", desc: "Connect with your favorite tools." },
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-500">Everything you need to know about the product and billing.</p>
            </div>
            
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                        {faq.question}
                    </h3>
                    <p className="text-slate-600 pl-7 leading-relaxed">
                      {faq.answer}
                    </p>
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

export default Pricing;