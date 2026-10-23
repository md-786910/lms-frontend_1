import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import SectionContainer from './SectionContainer';

const comparisonData = [
  {
    feature: 'Leave Request Tracking',
    spreadsheet: 'Manual entry prone to errors',
    lms: 'Automated with instant notifications'
  },
  {
    feature: 'Leave Balance Updates',
    spreadsheet: 'Manual calculations & updates',
    lms: 'Real-time automatic updates'
  },
  {
    feature: 'Approval Workflow',
    spreadsheet: 'Email back-and-forth chaos',
    lms: 'Streamlined approval process'
  },
  {
    feature: 'Data Security',
    spreadsheet: 'Vulnerable to accidental sharing',
    lms: 'Enterprise-grade encryption'
  },
  {
    feature: 'Salary Calculations',
    spreadsheet: 'Complex formulas & errors',
    lms: 'Automated with audit trail'
  },
  {
    feature: 'Employee Documents',
    spreadsheet: 'Scattered across folders',
    lms: 'Centralized & organized'
  },
  {
    feature: 'Reporting & Analytics',
    spreadsheet: 'Time-consuming pivot tables',
    lms: 'One-click comprehensive reports'
  },
  {
    feature: 'Mobile Access',
    spreadsheet: 'Limited or none',
    lms: 'Full-featured mobile app'
  },
  {
    feature: 'Data Backup & Recovery',
    spreadsheet: 'Manual & unreliable',
    lms: 'Automatic daily backups'
  },
  {
    feature: 'User Permissions',
    spreadsheet: 'All-or-nothing access',
    lms: 'Granular role-based control'
  },
];

const ComparisonRow = ({ item, index }) => {
  return (
    <tr className={`border-b border-[#E1D4C7] hover:bg-[#F5ECE4]/80 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F2]'}`}>
      <td className="px-6 py-4 font-heading font-bold text-sm text-[#2E2E2E] min-w-60">
        {item.feature}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <X size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <span className="text-[#5C5C5C] text-sm font-sans">{item.spreadsheet}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <Check size={18} className="text-[#C26819] flex-shrink-0 mt-0.5" />
          <span className="text-[#24130A] font-semibold text-sm font-sans">{item.lms}</span>
        </div>
      </td>
    </tr>
  );
};

const ComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#F5ECE4] font-sans text-[#2E2E2E] py-16 md:py-24 border-t border-[#E1D4C7]">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C26819]/10 border border-[#C26819]/25 text-[#734425] text-xs font-heading font-bold uppercase tracking-widest mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>📊</span> Smart Switch
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Why teams switch from spreadsheets
        </h2>
        <p className={`text-lg text-[#5A524C] leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Spreadsheets are great for quick tasks, but they're not built for enterprise HR operations. Here's what changes when you switch.
        </p>
      </div>

      {/* Comparison Table */}
      <div className={`overflow-x-auto rounded-3xl border border-[#E1D4C7] shadow-xl bg-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white">
              <th className="px-6 py-4 text-left font-heading font-bold text-sm uppercase tracking-wider">Feature</th>
              <th className="px-6 py-4 text-left font-heading font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Spreadsheets</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left font-heading font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Leanport HR</span>
                  <span className="bg-[#C26819] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <ComparisonRow key={index} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Advantages Section */}
      <div className={`mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {[
          {
            title: '10x Faster',
            description: 'Automate repetitive tasks and processes',
            icon: '⚡'
          },
          {
            title: 'Error-Free',
            description: 'Eliminate manual data entry mistakes',
            icon: '✅'
          },
          {
            title: 'Secure',
            description: 'Enterprise-grade data protection',
            icon: '🔒'
          },
          {
            title: 'Scalable',
            description: 'Grow without worrying about systems',
            icon: '📈'
          },
        ].map((advantage, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border border-[#E1D4C7] p-6 text-center hover:shadow-lg hover:border-[#734425]/40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${100 * (idx + 1)}ms` }}
          >
            <div className="text-3xl mb-3">{advantage.icon}</div>
            <h3 className="font-heading font-bold text-base text-[#2E2E2E] mb-2 uppercase tracking-wide">{advantage.title}</h3>
            <p className="text-[#5C5C5C] text-sm leading-relaxed">{advantage.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className={`mt-20 bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] rounded-3xl p-10 md:p-14 text-white text-center shadow-xl border border-[#734425]/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-3xl md:text-4xl font-heading font-black mb-4 uppercase tracking-tight text-white">Ready to leave spreadsheets behind?</h3>
        <p className="text-base md:text-lg text-[#F5ECE4]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of companies that have modernized their HR operations with our intelligent leave management system.
        </p>
        <a
          href="/company/get-started"
          className="inline-flex items-center justify-center bg-[#FAF6F2] hover:bg-white text-[#734425] px-8 py-4 rounded-full font-heading font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
        >
          Start Your Free Trial
        </a>
      </div>
    </SectionContainer>
  );
};

export default ComparisonSection;
