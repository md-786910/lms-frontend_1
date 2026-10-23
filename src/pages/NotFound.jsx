import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE4] p-6 font-sans text-[#2E2E2E] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#734425]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C26819]/10 rounded-full blur-3xl animate-pulse" />
      </div>
      <div className="text-center relative z-10 max-w-md p-8 bg-[#FAF6F2] border border-[#E1D4C7] rounded-3xl shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#734425] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="text-2xl font-black font-heading">404</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-[#2E2E2E] mb-2">
          Page Not Found
        </h1>
        <p className="text-[#5C5C5C] text-sm mb-6 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another location.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#734425] hover:bg-[#5D361D] text-[#FAF6F2] font-heading font-bold uppercase tracking-wider text-sm transition-all shadow-md hover:shadow-lg shadow-[#734425]/20"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
