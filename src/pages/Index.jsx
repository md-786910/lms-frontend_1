// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE4] p-6 font-sans text-[#2E2E2E]">
      <div className="text-center max-w-md p-8 bg-[#FAF6F2] border border-[#E1D4C7] rounded-3xl shadow-xl">
        <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-[#2E2E2E] mb-3">
          Leanport HRMS
        </h1>
        <p className="text-sm text-[#5C5C5C] mb-6">
          Premium human resource management and payroll system.
        </p>
        <a
          href="/company"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#734425] hover:bg-[#5D361D] text-[#FAF6F2] font-heading font-bold uppercase tracking-wider text-sm transition-all shadow-md"
        >
          Explore Platform
        </a>
      </div>
    </div>
  );
};

export default Index;
