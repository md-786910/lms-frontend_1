import React, { useEffect } from 'react';
import CompanyHeader from './CompanyHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import RolesSection from './RolesSection';
import ComparisonSection from './ComparisonSection';
import UseCasesSection from './UseCasesSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import CompanyFooter from './CompanyFooter';

const LandingPage = () => {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="overflow-hidden bg-white">
      {/* Header/Navigation */}
      <CompanyHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Roles Section */}
      <RolesSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <CompanyFooter />
    </div>
  );
};

export default LandingPage;
