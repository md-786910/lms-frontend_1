import React from 'react';

const SectionContainer = ({ children, className = '', id = '' }) => {
  return (
    <section id={id} className={`py-20 sm:py-24 lg:py-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
