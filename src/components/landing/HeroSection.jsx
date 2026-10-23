import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Button from './Button';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden bg-gradient-to-br from-[#24130A] via-[#381D0F] to-[#1C0E07] font-sans text-[#FAF6F2]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#734425] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C26819] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-[#734425] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-2 h-2 rounded-full bg-[#C26819] animate-pulse"></div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#F5ECE4]/90">Now with Real-time Notifications</span>
        </div>

        {/* Main heading */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-[#FAF6F2] mb-6 leading-tight uppercase tracking-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Leave Management <br />
          <span className="bg-gradient-to-r from-[#C26819] via-[#E88F44] to-[#C26819] bg-clip-text text-transparent">Made Simple</span>
        </h1>

        {/* Subheading */}
        <p className={`text-lg sm:text-xl text-[#F5ECE4]/80 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Streamline your HR operations with an intelligent leave management system. Designed for modern enterprises, loved by high-performing teams.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button 
            variant="accent" 
            size="lg"
            className="group"
          >
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="group text-white border-white/20 hover:bg-white/10"
          >
            Watch Demo
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust badges */}
        <div className={`inline-flex flex-col md:flex-row gap-8 text-xs font-heading font-semibold uppercase tracking-wider text-[#F5ECE4]/70 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
            <span>Used by 5000+ companies worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
            <span>99.9% uptime guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C26819]"></div>
            <span>GDPR & SOC2 Compliant</span>
          </div>
        </div>

        {/* Interactive Element - Dashboard Preview */}
        <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C26819] rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition-all duration-300"></div>
            <div className="relative bg-[#2E2E2E] rounded-2xl border border-white/15 p-2 shadow-2xl overflow-hidden">
              <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#734425]/20 to-[#C26819]/20"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#734425]/80 text-[#F5ECE4] backdrop-blur-md mb-4 hover:bg-[#C26819] transition-all cursor-pointer">
                    <ChevronRight size={32} className="ml-1" />
                  </div>
                  <p className="text-[#F5ECE4]/80 text-sm font-medium">Click to view interactive demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-heading uppercase tracking-wider text-[#F5ECE4]/60">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-[#F5ECE4]/40 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-[#C26819] rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
