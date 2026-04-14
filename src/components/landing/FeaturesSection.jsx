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
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Advanced Payroll',
    description: 'Automated salary generation, slip management, multi-currency support, and seamless deduction calculations.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Employee Lifecycle',
    description: 'Complete employee profiles with documents, address, personal info, and comprehensive history tracking.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: FileCheck,
    title: 'Document Management',
    description: 'Secure file uploads, document categorization, compliance tracking, and easy retrieval.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    title: 'Time & Attendance',
    description: 'Real-time clock in/out, work hours tracking, location-based time logging, and attendance analytics.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Instant alerts for leave requests, approvals, salary updates, and important HR events via WebSocket.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Settings,
    title: 'Flexible Configuration',
    description: 'Customizable departments, designations, leave policies, prefixes, and company settings.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: TrendingUp,
    title: 'Comprehensive Analytics',
    description: 'Detailed dashboards, leave trends, salary reports, and actionable insights for better decision-making.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'JWT authentication, role-based access, data encryption, and compliance standards.',
    color: 'from-violet-500 to-violet-600',
  },
];

const FeatkeyList = () => {
  return (
    <ul className="space-y-3 md:space-y-4">
      {['Leave balance tracking across departments', 'In-app & email notifications', 'Mobile-responsive design', 'One-click salary slip generation'].map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-gray-700">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-all duration-300`}></div>
      
      {/* Card */}
      <div className="relative h-full bg-white rounded-2xl border border-gray-200 p-8 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-transparent">
        {/* Icon container */}
        <div className={`inline-flex p-4 rounded-xl mb-6 bg-gradient-to-r ${feature.color} shadow-lg transition-all duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {feature.description}
        </p>

        {/* Hover action indicator */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-semibold text-blue-600 flex items-center gap-2">
            Learn more
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <SectionContainer className="bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          ✨ Powerful Features
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Everything you need to manage HR effectively
        </h2>
        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Comprehensive tools designed for modern organizations to streamline HR operations and improve employee experience.
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
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Trusted by HR teams worldwide
          </h3>
          <FeatkeyList />
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="space-y-6">
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="text-blue-100">Time saved on leave management</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-blue-100">Companies using LMS platform</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <p className="text-blue-100">System uptime & reliability</p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturesSection;
