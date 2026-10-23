import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BarChart3,
  Users,
  FileCheck,
  Clock,
  Settings,
  Bell,
  Shield,
  Zap,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react';
import SectionContainer from './SectionContainer';

const features = [
  {
    icon: Calendar,
    title: 'Smart Leave Management',
    description: 'Streamlined leave request process with instant approvals, automated balance tracking, and policy enforcement.',
    color: 'from-[#734425] to-[#5D361D]',
  },
  {
    icon: BarChart3,
    title: 'Advanced Payroll',
    description: 'Automated salary generation, slip management, multi-currency support, and seamless deduction calculations.',
    color: 'from-[#C26819] to-[#A6540F]',
  },
  {
    icon: Users,
    title: 'Employee Lifecycle',
    description: 'Complete employee profiles with documents, address, personal info, and comprehensive history tracking.',
    color: 'from-[#8A522D] to-[#734425]',
  },
  {
    icon: FileCheck,
    title: 'Document Management',
    description: 'Secure file uploads, document categorization, compliance tracking, and easy retrieval.',
    color: 'from-[#5D361D] to-[#24130A]',
  },
  {
    icon: Clock,
    title: 'Time & Attendance',
    description: 'Real-time clock in/out, work hours tracking, location-based time logging, and attendance analytics.',
    color: 'from-[#C26819] to-[#8A522D]',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Instant alerts for leave requests, approvals, salary updates, and important HR events via WebSocket.',
    color: 'from-[#734425] to-[#C26819]',
  },
  {
    icon: Settings,
    title: 'Flexible Configuration',
    description: 'Customizable departments, designations, leave policies, prefixes, and company settings.',
    color: 'from-[#8A522D] to-[#5D361D]',
  },
  {
    icon: TrendingUp,
    title: 'Comprehensive Analytics',
    description: 'Detailed dashboards, leave trends, salary reports, and actionable insights for better decision-making.',
    color: 'from-[#C26819] to-[#A6540F]',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'JWT authentication, role-based access, data encryption, and compliance standards.',
    color: 'from-[#24130A] to-[#734425]',
  },
];

const FeatkeyList = () => {
  return (
    <ul className="space-y-3 md:space-y-4">
      {['Leave balance tracking across departments', 'In-app & email notifications', 'Mobile-responsive design', 'One-click salary slip generation'].map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-[#2E2E2E]/80 font-medium">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#734425]/10 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-[#734425]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-all duration-300 pointer-events-none`}></div>
      
      {/* Card */}
      <div className="relative h-full bg-[#FAF6F2] rounded-3xl border border-[#E1D4C7] p-8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#734425]/10 group-hover:-translate-y-2 group-hover:border-[#734425]/30">
        {/* Icon container */}
        <div className={`inline-flex p-3 rounded-2xl mb-6 bg-gradient-to-r ${feature.color} text-white shadow-lg shadow-[#734425]/20 transition-all duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-bold text-[#2E2E2E] mb-3 group-hover:text-[#734425] transition-colors uppercase tracking-tight">
          {feature.title}
        </h3>
        <p className="text-[#2E2E2E]/70 leading-relaxed text-sm font-sans">
          {feature.description}
        </p>

        {/* Hover action indicator */}
        <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425] flex items-center gap-2">
            Learn more
            <svg className="w-4 h-4 text-[#C26819] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#F5ECE4] font-sans">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-1.5 rounded-full bg-[#734425]/10 text-[#734425] text-xs font-heading font-bold uppercase tracking-wider mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          ✨ Powerful Features
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 leading-tight uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Everything you need to manage HR effectively
        </h2>
        <p className={`text-lg text-[#2E2E2E]/70 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Comprehensive tools designed for modern organizations to streamline HR operations and elevate workplace clarity.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${100 * (index + 1)}ms` }}
          >
            <FeatureCard feature={feature} index={index} />
          </div>
        ))}
      </div>

      {/* Highlight section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div>
          <h3 className="text-3xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight">
            Trusted by HR teams worldwide
          </h3>
          <FeatkeyList />
        </div>
        <div className="bg-gradient-to-br from-[#24130A] via-[#734425] to-[#5D361D] rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C26819]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <div>
              <div className="text-4xl font-heading font-black text-[#C26819] mb-1">95%</div>
              <p className="text-[#F5ECE4]/80 text-sm">Time saved on leave management workflows</p>
            </div>
            <div>
              <div className="text-4xl font-heading font-black text-[#C26819] mb-1">5000+</div>
              <p className="text-[#F5ECE4]/80 text-sm">Companies powered by LMS platform</p>
            </div>
            <div>
              <div className="text-4xl font-heading font-black text-[#C26819] mb-1">99.9%</div>
              <p className="text-[#F5ECE4]/80 text-sm">System uptime & enterprise reliability</p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;
