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
      <div className={`relative group h-full rounded-2xl border-2 transition-all duration-300 ${plan.highlighted ? 'border-blue-600 ring-2 ring-blue-100' : isHovered ? 'border-blue-300' : 'border-gray-200'}`}>
        {/* Highlighted badge */}
        {plan.highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <Zap size={16} />
            Most Popular
          </div>
        )}

        <div className={`p-8 h-full flex flex-col ${plan.highlighted ? 'bg-gradient-to-br from-blue-50 to-white' : 'bg-white'} transition-all duration-300 ${isHovered ? 'shadow-xl' : 'shadow-lg'}`}>
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-600">{plan.period}</span>}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-grow">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check size={20} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-600' : 'text-green-500'}`} />
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            variant={plan.highlighted ? 'primary' : 'secondary'}
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
    <SectionContainer className="bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          💰 Simple Pricing
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Plans that scale with your business
        </h2>
        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          No hidden fees. Cancel anytime. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Billing toggle */}
      <div className={`flex justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Annual <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Save 20%</span>
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
      <div className={`bg-white rounded-2xl border border-gray-200 p-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">What's included in every plan?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Check size={20} className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PricingSection;
