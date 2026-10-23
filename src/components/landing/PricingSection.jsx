import React, { useState, useEffect } from 'react';
import { Check, Zap } from 'lucide-react';
import SectionContainer from './SectionContainer';
import Button from './Button';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$199',
    period: '/month',
    description: 'Perfect for small teams',
    features: [
      'Up to 50 employees',
      'Basic leave management',
      'Simple payroll',
      'Email support',
      'Standard security',
      'Mobile app access'
    ],
    cta: 'Start Free Trial',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$499',
    period: '/month',
    description: 'For growing companies',
    features: [
      'Up to 500 employees',
      'Advanced leave policies',
      'Multi-location support',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'API access',
      'Time & attendance tracking'
    ],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited employees',
      'Full customization',
      'Dedicated support',
      'Advanced security',
      'Custom workflows',
      'White-label option',
      'SLA guarantee',
      'Onboarding assistance'
    ],
    cta: 'Contact Sales',
    highlighted: false
  },
];

const PricingCard = ({ plan, isVisible, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${100 * (index + 1)}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative group h-full rounded-3xl border-2 transition-all duration-300 ${plan.highlighted ? 'border-[#734425] ring-4 ring-[#734425]/10 shadow-2xl' : isHovered ? 'border-[#734425]/40 shadow-xl' : 'border-[#E1D4C7]'}`}>
        {/* Highlighted badge */}
        {plan.highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C26819] text-white px-4 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Zap size={14} />
            Most Popular
          </div>
        )}

        <div className={`p-8 h-full flex flex-col rounded-3xl ${plan.highlighted ? 'bg-[#FAF6F2]' : 'bg-[#FAF6F2]'} transition-all duration-300`}>
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-heading font-extrabold text-[#2E2E2E] mb-2 uppercase tracking-tight">{plan.name}</h3>
            <p className="text-[#2E2E2E]/60 text-sm mb-4 font-medium">{plan.description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-heading font-black text-[#2E2E2E]">{plan.price}</span>
              {plan.period && <span className="text-[#2E2E2E]/60 text-sm font-medium">{plan.period}</span>}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-grow">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check size={18} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#C26819]' : 'text-[#734425]'}`} />
                <span className="text-[#2E2E2E]/80 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            variant={plan.highlighted ? 'accent' : 'primary'}
            size="md"
            className="w-full justify-center"
          >
            {plan.cta}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#F5ECE4] font-sans text-[#2E2E2E]">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-1.5 rounded-full bg-[#734425]/10 text-[#734425] text-xs font-heading font-bold uppercase tracking-wider mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          💰 Simple Pricing
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 leading-tight uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Plans that scale with your business
        </h2>
        <p className={`text-lg text-[#2E2E2E]/70 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          No hidden fees. Cancel anytime. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Billing toggle */}
      <div className={`flex justify-center gap-3 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-[#734425] text-white shadow-md' : 'bg-[#E1D4C7]/60 text-[#2E2E2E] hover:bg-[#E1D4C7]'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          className={`px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 ${billingCycle === 'annual' ? 'bg-[#734425] text-white shadow-md' : 'bg-[#E1D4C7]/60 text-[#2E2E2E] hover:bg-[#E1D4C7]'}`}
        >
          Annual <span className="ml-2 text-[10px] bg-[#C26819] text-white px-2 py-0.5 rounded-full">Save 20%</span>
        </button>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan}
            isVisible={isVisible}
            index={index}
          />
        ))}
      </div>

      {/* FAQ section under pricing */}
      <div className={`bg-[#FAF6F2] rounded-3xl border border-[#E1D4C7] p-8 md:p-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-2xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight">What's included in every plan?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            'Real-time leave management',
            'Automated payroll processing',
            'Employee self-service portal',
            'Advanced analytics & reports',
            'Mobile app access',
            'GDPR & SOC2 compliance',
            '99.9% uptime SLA',
            'Free technical support'
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Check size={18} className="text-[#C26819] flex-shrink-0" />
              <span className="text-[#2E2E2E]/80 text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PricingSection;
