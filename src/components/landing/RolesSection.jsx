import React, { useState, useEffect } from 'react';
import { Shield, Building2, User, ArrowRight } from 'lucide-react';
import SectionContainer from './SectionContainer';
import Button from './Button';

const roles = [
  {
    title: 'Admin Dashboard',
    icon: Shield,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
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
    color: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
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
    color: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
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
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${role.color} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-300`}></div>

      {/* Card */}
      <div className={`relative rounded-2xl border-2 transition-all duration-300 ${isHovered || isCenter ? `border-none bg-gradient-to-br ${role.color} text-white` : `border-gray-200 bg-white`} ${isCenter ? 'shadow-2xl' : 'hover:shadow-2xl'} overflow-hidden`}>
        {/* Top accent bar */}
        <div className={`h-1.5 bg-gradient-to-r ${role.color}`}></div>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-300 ${isHovered || isCenter ? 'bg-white/20' : 'bg-gray-100'}`}>
            <Icon className={`w-8 h-8 ${isHovered || isCenter ? 'text-white' : 'text-gray-800'}`} />
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-6 ${isHovered || isCenter ? 'text-white' : 'text-gray-900'}`}>
            {role.title}
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200 group-hover:border-white/20">
            {role.stats.map((stat, idx) => (
              <div key={idx}>
                <div className={`text-2xl font-bold ${isHovered || isCenter ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${isHovered || isCenter ? 'text-white/70' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features list */}
          <ul className="space-y-3 mb-8">
            {role.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHovered || isCenter ? 'text-white/80' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`text-sm ${isHovered || isCenter ? 'text-white/80' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isHovered || isCenter ? 'bg-white/20 hover:bg-white/30 text-white border border-white/40' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
            Explore Role
            <ArrowRight size={18} className={`${isHovered || isCenter ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </button>
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
    <SectionContainer className="bg-white" id="roles">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          👥 Multi-Role System
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Built for every role in your organization
        </h2>
        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Tailored dashboards and permissions for Admins, Company managers, and Employees. Each role gets exactly what they need.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-4 mb-16">
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
      <div className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Seamless Role-Based Transitions</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Users can easily switch between roles based on their organizational permissions. No need to log out and log back in—everything is integrated into a single unified platform
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Single login for multiple roles</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Instant role switching</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span>Unified notification center</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-2xl opacity-20"></div>
            <div className="relative bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-600/50 hover:bg-gray-600 transition-colors cursor-pointer">
                  <Shield size={18} className="text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold">Switch to Admin Dashboard</p>
                    <p className="text-xs text-gray-400">Full system access</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-600/50 hover:bg-gray-600 transition-colors cursor-pointer">
                  <Building2 size={18} className="text-purple-400" />
                  <div>
                    <p className="text-sm font-semibold">Switch to Company View</p>
                    <p className="text-xs text-gray-400">Company management</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-600/50 hover:bg-gray-600 transition-colors cursor-pointer">
                  <User size={18} className="text-green-400" />
                  <div>
                    <p className="text-sm font-semibold">Employee Portal</p>
                    <p className="text-xs text-gray-400">Personal workspace</p>
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
