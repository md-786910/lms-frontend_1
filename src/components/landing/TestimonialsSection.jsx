import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionContainer from './SectionContainer';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'HR Manager',
    company: 'TechCorp Inc.',
    image: '👩‍💼',
    rating: 5,
    content: 'The LMS platform completely transformed how we handle leaves. What used to take 2 hours per week now takes 10 minutes. Our employees love the transparency and instant notifications.',
    metrics: 'Reduced admin time by 90%'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Operations Head',
    company: 'GrowthHub',
    image: '👨‍💼',
    rating: 5,
    content: 'Switching from spreadsheets was the best decision we made. The system handles our multi-currency payroll seamlessly, and the audit trail gives us compliance confidence.',
    metrics: '500+ employees managed'
  },
  {
    name: 'Emily Chen',
    role: 'People & Culture Lead',
    company: 'InnovateLabs',
    image: '👩‍💼',
    rating: 5,
    content: 'Our team feels more organized than ever. Leave requests are processed within minutes, reports are generated instantly, and employee satisfaction has improved significantly.',
    metrics: 'Employee satisfaction +75%'
  },
  {
    name: 'Marcus Williams',
    role: 'HR Lead',
    company: 'DataSystems',
    image: '👨‍💼',
    rating: 5,
    content: 'The real-time notifications and role-based dashboards mean our managers can make informed decisions instantly. The time tracking module is incredibly accurate.',
    metrics: 'Processing time -85%'
  },
  {
    name: 'Priya Sharma',
    role: 'Finance Director',
    company: 'FinServe',
    image: '👩‍💼',
    rating: 5,
    content: 'The salary generation and management features are top-notch. Everything is automated, documented, and traceable. Compliance has never been easier.',
    metrics: '1000+ slips/month'
  },
  {
    name: 'David Thompson',
    role: 'CEO',
    company: 'StartupXYZ',
    image: '👨‍💼',
    rating: 5,
    content: 'Scalability was our concern when growing. LMS scaled effortlessly as we hired more people. The system just works, freeing us to focus on growth.',
    metrics: '200+ employees in 18 months'
  },
];

const TestimonialCard = ({ testimonial, isActive }) => {
  return (
    <div className={`group transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
      <div className="bg-[#FAF6F2] rounded-3xl border border-[#E1D4C7] p-8 h-full shadow-sm hover:shadow-xl hover:border-[#734425]/40 transition-all duration-300">
        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={16} className="fill-[#C26819] text-[#C26819]" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-[#2E2E2E] text-base leading-relaxed mb-6 italic font-sans">
          "{testimonial.content}"
        </p>

        {/* Metrics highlight */}
        <div className="bg-white rounded-xl px-4 py-3 mb-6 border-l-4 border-[#C26819] shadow-sm">
          <p className="text-[#734425] font-heading font-bold text-xs uppercase tracking-wide">{testimonial.metrics}</p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-[#E1D4C7]">
          <div className="text-3xl">{testimonial.image}</div>
          <div>
            <div className="font-heading font-bold text-sm uppercase tracking-wide text-[#24130A]">{testimonial.name}</div>
            <div className="text-xs text-[#5C5C5C] font-medium">{testimonial.role}</div>
            <div className="text-[11px] text-[#734425] font-semibold">{testimonial.company}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  return (
    <SectionContainer className="bg-[#F5ECE4] font-sans text-[#2E2E2E] py-16 md:py-24 border-t border-[#E1D4C7]" id="testimonials">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C26819]/10 border border-[#C26819]/25 text-[#734425] text-xs font-heading font-bold uppercase tracking-widest mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>⭐</span> Success Stories
        </div>
        <h2 className={`text-4xl md:text-5xl font-heading font-black text-[#2E2E2E] mb-6 uppercase tracking-tight transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Loved by HR teams everywhere
        </h2>
        <p className={`text-lg text-[#5A524C] leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          See how companies across industries are transforming their HR operations with our platform.
        </p>
      </div>

      {/* Carousel */}
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => {
            const position = (index - activeIndex + testimonials.length) % testimonials.length;
            const isActive = position === 0;

            return (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-500 ${isActive ? 'md:scale-105 md:z-20' : 'md:scale-95'} ${position > 2 ? 'hidden' : ''}`}
                onClick={() => {
                  setActiveIndex(index);
                  setAutoPlay(false);
                }}
              >
                <TestimonialCard 
                  testimonial={testimonial}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-[#E1D4C7] bg-white text-[#734425] hover:bg-[#FAF6F2] hover:border-[#734425] transition-all duration-300 shadow-sm"
          >
            <ChevronLeft size={20} className="hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setAutoPlay(false);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-[#734425] w-8'
                    : 'bg-[#E1D4C7] w-2.5 hover:bg-[#734425]/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full border border-[#E1D4C7] bg-white text-[#734425] hover:bg-[#FAF6F2] hover:border-[#734425] transition-all duration-300 shadow-sm"
          >
            <ChevronRight size={20} className="hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Trust stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {[
          { value: '5000+', label: 'Active Companies' },
          { value: '4.9', label: 'Average Rating' },
          { value: '100K+', label: 'Happy Employees' },
          { value: '99.9%', label: 'Uptime' },
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-6 bg-[#FAF6F2] rounded-2xl border border-[#E1D4C7] shadow-sm">
            <div className="text-3xl md:text-4xl font-heading font-black text-[#734425] mb-2">{stat.value}</div>
            <div className="text-xs font-heading font-bold text-[#5C5C5C] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default TestimonialsSection;
