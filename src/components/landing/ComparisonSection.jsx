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
    <tr className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
      <td className="px-6 py-4 font-semibold text-gray-900 min-w-60">
        {item.feature}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600">{item.spreadsheet}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <span className="text-gray-900 font-medium">{item.lms}</span>
        </div>
      </td>
    </tr>
  );
};

const ComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          📊 Smart Switch
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Why teams switch from spreadsheets
        </h2>
        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Spreadsheets are great for quick tasks, but they're not built for enterprise HR operations. Here's what changes when you switch.
        </p>
      </div>

      {/* Comparison Table */}
      <div className={`overflow-x-auto rounded-2xl border border-gray-200 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <th className="px-6 py-4 text-left font-bold text-lg">Feature</th>
              <th className="px-6 py-4 text-left font-bold text-lg">
                <div className="flex items-center gap-2">
                  <span>Spreadsheets</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left font-bold text-lg">
                <div className="flex items-center gap-2">
                  <span>LMS Platform</span>
                  <span className="bg-blue-500 text-xs px-2 py-1 rounded">Better</span>
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
            className={`bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${100 * (idx + 1)}ms` }}
          >
            <div className="text-4xl mb-3">{advantage.icon}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{advantage.title}</h3>
            <p className="text-gray-600 text-sm">{advantage.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className={`mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-3xl font-bold mb-4">Ready to leave spreadsheets behind?</h3>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of companies that have modernized their HR operations with our intelligent leave management system.
        </p>
        <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300 inline-block">
          Start Your Free Trial
        </button>
      </div>
    </SectionContainer>
  );
};

export default ComparisonSection;
