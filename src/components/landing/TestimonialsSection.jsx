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
    <div className={`group transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full hover:shadow-xl transition-shadow duration-300">
        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
          "{testimonial.content}"
        </p>

        {/* Metrics highlight */}
        <div className="bg-blue-50 rounded-lg px-4 py-3 mb-6 border-l-4 border-blue-500">
          <p className="text-blue-900 font-semibold text-sm">{testimonial.metrics}</p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="text-4xl">{testimonial.image}</div>
          <div>
            <div className="font-bold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-600">{testimonial.role}</div>
            <div className="text-xs text-gray-500">{testimonial.company}</div>
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
    <SectionContainer className="bg-white" id="testimonials">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className={`inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          ⭐ Success Stories
        </div>
        <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Loved by HR teams everywhere
        </h2>
        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
                className={`cursor-pointer transition-all duration-500 ${isActive ? 'md:scale-110 md:z-20' : 'md:scale-95'} ${position > 2 ? 'hidden' : ''}`}
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
            className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
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
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
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
          <div key={idx} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default TestimonialsSection;
