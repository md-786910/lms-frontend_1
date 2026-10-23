import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionContainer from './SectionContainer';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is an LMS and how does it differ from spreadsheets?',
        a: 'An LMS (Leave Management System) is a centralized platform designed to automate and streamline leave management. Unlike spreadsheets, it offers real-time automation, role-based access control, audit trails, scalability, and mobile access. It eliminates manual errors and saves significant time.'
      },
      {
        q: 'Is LMS suitable for small companies?',
        a: 'Absolutely! LMS scales from small startups to large enterprises. Our pricing and features are designed to grow with your organization. Even small teams benefit from automation, organized data, and professional workflows.'
      },
      {
        q: 'What kind of support do you provide?',
        a: 'We offer 24/7 customer support through email, chat, and phone. We also provide comprehensive documentation, video tutorials, and personalized onboarding for enterprise clients.'
      }
    ]
  },
  {
    category: 'Security & Compliance',
    questions: [
      {
        q: 'How secure is my data?',
        a: 'We use enterprise-grade security including AES-256 encryption, SSL/TLS for data in transit, regular security audits, and SOC 2 Type II compliance. Your data is protected with multi-layer security protocols.'
      },
      {
        q: 'Is the system GDPR compliant?',
        a: 'Yes, we are fully GDPR compliant. We ensure data privacy, provide data export capabilities, honor deletion requests, and maintain detailed audit logs for compliance requirements.'
      },
      {
        q: 'Can you guarantee data backup and recovery?',
        a: 'We perform automatic daily backups with redundant storage across multiple geographic locations. In case of any issue, we can restore data with minimal downtime. Our 99.9% uptime SLA ensures reliability.'
      }
    ]
  },
  {
    category: 'Features & Functionality',
    questions: [
      {
        q: 'Can I customize leave types and policies?',
        a: 'Yes, completely. You can create unlimited leave types (Sick, Casual, Annual, etc.), set different policies for different departments, configure accrual rules, and manage approver hierarchies.'
      },
      {
        q: 'Does the system integrate with payroll?',
        a: 'Yes. LMS has built-in payroll management with automated salary generation, component configuration (HRA, bonus, deductions), multi-currency support, and comprehensive salary slip generation.'
      },
      {
        q: 'Can employees access LMS from mobile devices?',
        a: 'Yes, LMS is fully responsive and mobile-friendly. Employees can submit leave requests, check balances, view salary information, and approve requests from any device using the mobile-optimized interface.'
      }
    ]
  },
  {
    category: 'Implementation & Onboarding',
    questions: [
      {
        q: 'How long does implementation take?',
        a: 'Basic setup takes 1-2 days. Full configuration including data migration typically takes 1-2 weeks depending on your organization size and requirements. Our team guides you through every step.'
      },
      {
        q: 'Can you migrate my existing data from spreadsheets?',
        a: 'Absolutely. We provide free data migration services. You share your existing data, and our team handles the import, validation, and verification to ensure accuracy.'
      },
      {
        q: 'Do you provide training for our team?',
        a: 'Yes, we provide comprehensive training including live video sessions, documentation, tutorials, and ongoing support. We ensure all stakeholders (admins, managers, employees) are comfortable using the system.'
      }
    ]
  },
  {
    category: 'Pricing & Plans',
    questions: [
      {
        q: 'What is your pricing model?',
        a: 'We offer flexible pricing based on number of employees and required features. Plans typically range from $50-500+ per month depending on company size. We also offer custom enterprise pricing.'
      },
      {
        q: 'Is there a free trial?',
        a: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required. You can test-drive the system with your actual organizational setup.'
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, there are no long-term contracts. You can upgrade, downgrade, or cancel your subscription anytime without penalties. We also offer a data export option for continuity.'
      }
    ]
  }
];

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-[#E1D4C7] bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#734425]/40 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#F5ECE4]/50 transition-colors duration-200"
      >
        <span className="font-heading font-bold text-[#2E2E2E] text-base">{question}</span>
        <ChevronDown
          size={20}
          className={`text-[#734425] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-[#FAF6F2] border-t border-[#E1D4C7]">
          <p className="text-[#5C5C5C] leading-relaxed text-sm font-sans">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQCategory = ({ category, questions, isVisible, index }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${100 * (index + 1)}ms` }}
    >
      <h3 className="text-xl font-heading font-bold text-[#24130A] uppercase tracking-wide mb-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
        {category}
      </h3>
      <div className="space-y-4 mb-12 lg:mb-0">
        {questions.map((item, idx) => (
          <FAQItem
            key={idx}
            question={item.q}
            answer={item.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
          />
        ))}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <SectionContainer className="bg-[#FAF6F2] font-sans text-[#2E2E2E] py-16 md:py-24 border-t border-[#E1D4C7]" id="faq">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#734425]/10 border border-[#734425]/25 text-[#734425] text-xs font-heading font-bold uppercase tracking-widest mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>❓</span> FAQ
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Questions? We've got answers
        </h2>
        <p className={`text-lg text-[#5A524C] leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Everything you need to know about implementing and using our LMS platform.
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {faqData.map((category, index) => (
          <FAQCategory
            key={index}
            category={category.category}
            questions={category.questions}
            isVisible={isVisible}
            index={index}
          />
        ))}
      </div>

      {/* CTA for more support */}
      <div className={`mt-16 bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] rounded-3xl p-10 md:p-14 text-white text-center shadow-xl border border-[#734425]/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h3 className="text-2xl md:text-3xl font-heading font-black mb-4 uppercase tracking-tight text-white">Still have questions?</h3>
        <p className="text-base text-[#F5ECE4]/80 mb-8 max-w-xl mx-auto">
          Our support team is ready to help. Reach out to us anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/company/contact"
            className="px-8 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider bg-[#FAF6F2] text-[#734425] hover:bg-white transition-all shadow-md"
          >
            Contact Support
          </a>
          <a
            href="/company/contact"
            className="px-8 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Schedule Demo
          </a>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FAQSection;
