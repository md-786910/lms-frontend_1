import React, { useState, useEffect } from 'react';
import { Shield, Building2, User, ArrowRight } from 'lucide-react';
import SectionContainer from './SectionContainer';
import Button from './Button';

const roles = [
  {
    title: 'Admin Dashboard',
    icon: Shield,
    color: 'from-[#24130A] via-[#734425] to-[#5D361D]',
    bgColor: 'bg-[#F5ECE4]',
    features: [
      'Full system access & configuration',
      'Company and employee management',
      'Leave approval & rejection',
      'Salary generation & processing',
      'User creation & role assignment',
      'Comprehensive analytics & reports',
      'Settings management',
      'Holiday calendar configuration'
    ],
    stats: [
      { value: 'Unlimited', label: 'Companies' },
      { value: 'Full', label: 'Control' }
    ]
  },
  {
    title: 'Company Management',
    icon: Building2,
    color: 'from-[#734425] to-[#8C532E]',
    bgColor: 'bg-[#FAF6F2]',
    features: [
      'Company-specific dashboard',
      'Employee roster management',
      'Department configuration',
      'Designation management',
      'Leave policy setup',
      'Company settings & branding',
      'Employee lifecycle management',
      'Departmental analytics'
    ],
    stats: [
      { value: '500+', label: 'Employees' },
      { value: 'Unlimited', label: 'Departments' }
    ]
  },
  {
    title: 'Employee Portal',
    icon: User,
    color: 'from-[#C26819] to-[#A85712]',
    bgColor: 'bg-[#F5ECE4]',
    features: [
      'Personal leave dashboard',
      'Leave request submission',
      'Salary slip access',
      'Profile management',
      'Document uploads',
      'Time & attendance tracking',
      'Real-time notifications',
      'Historical data access'
    ],
    stats: [
      { value: 'Instant', label: 'Notifications' },
      { value: '24/7', label: 'Access' }
    ]
  }
];

const RoleCard = ({ role, isCenter }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = role.icon;

  return (
    <div
      className={`group relative transition-all duration-500 ${isCenter ? 'md:scale-105 md:z-10' : ''} ${isHovered ? 'z-20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient orb */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${role.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-300`}></div>

      {/* Card */}
      <div className={`relative rounded-3xl border transition-all duration-300 ${isHovered || isCenter ? `border-none bg-gradient-to-br ${role.color} text-white` : `border-[#E1D4C7] bg-white`} ${isCenter ? 'shadow-2xl' : 'hover:shadow-xl'} overflow-hidden`}>
        {/* Top accent bar */}
        <div className={`h-1.5 bg-gradient-to-r ${role.color}`}></div>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className={`inline-flex p-3 rounded-2xl mb-6 transition-all duration-300 ${isHovered || isCenter ? 'bg-white/20' : 'bg-[#FAF6F2] border border-[#E1D4C7]'}`}>
            <Icon className={`w-6 h-6 ${isHovered || isCenter ? 'text-white' : 'text-[#734425]'}`} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-heading font-extrabold mb-4 uppercase tracking-wide ${isHovered || isCenter ? 'text-white' : 'text-[#2E2E2E]'}`}>
            {role.title}
          </h3>

          {/* Stats */}
          <div className={`grid grid-cols-2 gap-4 mb-8 pb-6 border-b ${isHovered || isCenter ? 'border-white/20' : 'border-[#E1D4C7]'}`}>
            {role.stats.map((stat, idx) => (
              <div key={idx}>
                <div className={`text-2xl font-heading font-black ${isHovered || isCenter ? 'text-white' : 'text-[#734425]'}`}>
                  {stat.value}
                </div>
                <div className={`text-xs font-heading font-bold uppercase tracking-wider ${isHovered || isCenter ? 'text-white/80' : 'text-[#5C5C5C]'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features list */}
          <ul className="space-y-3 mb-8 font-sans">
            {role.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHovered || isCenter ? 'text-white/90' : 'text-[#C26819]'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`text-xs leading-relaxed ${isHovered || isCenter ? 'text-white/90' : 'text-[#5C5C5C]'}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <a
            href="/company/get-started"
            className={`w-full py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${isHovered || isCenter ? 'bg-white text-[#734425] hover:bg-[#FAF6F2] shadow-md' : 'bg-[#FAF6F2] hover:bg-[#E1D4C7] text-[#2E2E2E]'}`}
          >
            Explore Role
            <ArrowRight size={16} className={`${isHovered || isCenter ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </a>
        </div>
      </div>
    </div>
  );
};

const RolesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#F5ECE4] font-sans text-[#2E2E2E] py-16 md:py-24 border-t border-[#E1D4C7]" id="roles">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#734425]/10 border border-[#734425]/25 text-[#734425] text-xs font-heading font-bold uppercase tracking-widest mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>👥</span> Multi-Role System
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Built for every role in your organization
        </h2>
        <p className={`text-lg text-[#5A524C] leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Tailored dashboards and permissions for Admins, Company managers, and Employees. Each role gets exactly what they need.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 mb-16">
        {roles.map((role, index) => (
          <div
            key={index}
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${150 * (index + 1)}ms` }}
          >
            <RoleCard role={role} isCenter={index === 1} />
          </div>
        ))}
      </div>

      {/* Integration section */}
      <div className={`bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] rounded-3xl p-10 md:p-14 text-white shadow-xl border border-[#734425]/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-heading font-black mb-6 uppercase tracking-tight text-white">Seamless Role-Based Transitions</h3>
            <p className="text-[#F5ECE4]/80 mb-8 leading-relaxed font-sans text-base">
              Users can easily switch between roles based on their organizational permissions. No need to log out and log back in—everything is integrated into a single unified platform.
            </p>
            <ul className="space-y-4 font-sans text-sm">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
                <span>Single login for multiple roles</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
                <span>Instant role switching</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
                <span>Unified notification center</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#C26819] rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-[#FAF6F2] rounded-2xl p-6 border border-[#E1D4C7] shadow-xl text-[#2E2E2E]">
              <div className="space-y-3 font-sans">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E1D4C7] hover:border-[#734425]/40 transition-colors cursor-pointer shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#734425]/10 flex items-center justify-center text-[#734425] shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold uppercase text-[#24130A]">Switch to Admin Dashboard</p>
                    <p className="text-xs text-[#5C5C5C]">Full system access</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E1D4C7] hover:border-[#734425]/40 transition-colors cursor-pointer shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#734425]/10 flex items-center justify-center text-[#734425] shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold uppercase text-[#24130A]">Switch to Company View</p>
                    <p className="text-xs text-[#5C5C5C]">Company management</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#E1D4C7] hover:border-[#C26819]/40 transition-colors cursor-pointer shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-[#C26819]/10 flex items-center justify-center text-[#C26819] shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold uppercase text-[#24130A]">Employee Portal</p>
                    <p className="text-xs text-[#5C5C5C]">Personal workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default RolesSection;
