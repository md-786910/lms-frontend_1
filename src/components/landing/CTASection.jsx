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
      <SectionContainer className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to transform your HR operations?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of companies simplifying leave management and payroll. Get started with a 14-day free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="secondary"
                size="lg"
                className="text-blue-600 hover:text-blue-700 group"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group"
              >
                Schedule a Demo
                <MessageSquare size={20} />
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-8">
              No credit card required. Full access to all features for 14 days.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Newsletter signup section */}
      <SectionContainer className="bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Stay updated</h3>
            <p className="text-gray-600 mb-8">
              Get the latest HR insights, feature releases, and best practices delivered to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-grow px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
              >
                Subscribe
                <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <p className="text-gray-500 text-sm">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default CTASection;
