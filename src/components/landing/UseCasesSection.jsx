import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, Users, Leaf, Code2, Zap } from 'lucide-react';
import SectionContainer from './SectionContainer';

const useCases = [
  {
    icon: Briefcase,
    title: 'For HR Directors',
    color: 'from-[#24130A] to-[#5D361D]',
    benefits: [
      'Complete visibility into HR operations',
      'Automated compliance reporting',
      'Strategic workforce analytics',
      'Time saved for strategic initiatives'
    ]
  },
  {
    icon: TrendingUp,
    title: 'For Finance Teams',
    color: 'from-[#734425] to-[#8C532E]',
    benefits: [
      'Accurate payroll processing',
      'Audit-ready record keeping',
      'Multi-currency & multi-entity support',
      'Automated deduction calculations'
    ]
  },
  {
    icon: Users,
    title: 'For Line Managers',
    color: 'from-[#C26819] to-[#A85712]',
    benefits: [
      'One-click leave approvals',
      'Team leave calendar visibility',
      'Performance insights',
      'Reduced administrative burden'
    ]
  },
  {
    icon: Leaf,
    title: 'For Employees',
    color: 'from-[#4A2613] to-[#734425]',
    benefits: [
      'Instant leave request submission',
      'Mobile app access anytime',
      'Transparent processing',
      'Self-service salary information'
    ]
  },
];

const UseCaseCard = ({ useCase, isVisible, index }) => {
  const Icon = useCase.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${100 * (index + 1)}ms` }}
    >
      <div className={`relative h-full rounded-3xl p-8 transition-all duration-300 ${isHovered ? `bg-gradient-to-br ${useCase.color} text-white shadow-2xl -translate-y-2` : 'bg-white border border-[#E1D4C7] hover:border-[#734425]/40 shadow-sm'}`}>
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl mb-6 ${isHovered ? 'bg-white/20' : `bg-gradient-to-br ${useCase.color} text-white`} transition-all duration-300 shadow-sm`}>
          <Icon size={28} className="text-white" />
        </div>

        {/* Title */}
        <h3 className={`text-xl font-heading font-bold mb-4 uppercase tracking-wide ${isHovered ? 'text-white' : 'text-[#2E2E2E]'}`}>
          {useCase.title}
        </h3>

        {/* Benefits */}
        <ul className="space-y-3 font-sans">
          {useCase.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHovered ? 'text-white/90' : 'text-[#C26819]'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className={`text-sm leading-relaxed ${isHovered ? 'text-white/90' : 'text-[#5C5C5C]'}`}>
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const UseCasesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#FAF6F2] font-sans text-[#2E2E2E] py-16 md:py-24 border-t border-[#E1D4C7]">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#734425]/10 border border-[#734425]/25 text-[#734425] text-xs font-heading font-bold uppercase tracking-widest mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>🎯</span> Use Cases
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Perfect for every stakeholder
        </h2>
        <p className={`text-lg text-[#5A524C] leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Whether you're an HR leader, finance professional, manager, or employee, LMS delivers value across your entire organization.
        </p>
      </div>

      {/* Use case cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {useCases.map((useCase, index) => (
          <UseCaseCard
            key={index}
            useCase={useCase}
            isVisible={isVisible}
            index={index}
          />
        ))}
      </div>
    </SectionContainer>
  );
};

export default UseCasesSection;
