import React, { useEffect, useState } from 'react';
import { ArrowRight, Mail, MessageSquare } from 'lucide-react';
import SectionContainer from './SectionContainer';
import Button from './Button';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div>
      {/* Main CTA Banner */}
      <SectionContainer className="bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] relative overflow-hidden font-sans text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C26819]/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FAF6F2]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center py-6">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 leading-tight uppercase tracking-tight">
              Ready to transform your HR operations?
            </h2>
            <p className="text-lg md:text-xl text-[#F5ECE4]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of companies simplifying leave management and payroll. Get started with a 14-day free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="accent"
                size="lg"
                className="group shadow-xl shadow-black/20"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group text-white border-white/20 hover:bg-white/10"
              >
                Schedule a Demo
                <MessageSquare size={20} />
              </Button>
            </div>

            <p className="text-[#F5ECE4]/60 text-xs font-heading font-semibold uppercase tracking-wider mt-8">
              No credit card required • Full access to all features for 14 days
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Newsletter signup section */}
      <SectionContainer className="bg-[#FAF6F2] font-sans border-t border-[#E1D4C7]">
        <div className="max-w-2xl mx-auto text-center py-6">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-3xl font-heading font-extrabold text-[#2E2E2E] mb-3 uppercase tracking-tight">Stay updated</h3>
            <p className="text-[#2E2E2E]/70 mb-8 font-medium">
              Get the latest HR insights, feature releases, and best practices delivered to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-grow px-6 py-3.5 border-2 border-[#E1D4C7] bg-white rounded-full focus:outline-none focus:border-[#734425] focus:ring-4 focus:ring-[#C26819]/15 text-[#2E2E2E] transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#734425] hover:bg-[#5D361D] text-white font-heading font-bold uppercase tracking-wider rounded-full shadow-lg shadow-[#734425]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Subscribe
                <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <p className="text-[#2E2E2E]/50 text-xs">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default CTASection;
