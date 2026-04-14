import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building, CircleQuestionMark, LogIn, Globe, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Features", href: "/company/features" },
    { name: "Services", href: "/company/services" },
    { name: "Pricing", href: "/company/pricing" },
    { name: "Why Us", href: "/company/why-us" },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full relative z-[100]">
      {/* Top Header Row */}
      <div className="bg-[#0f172a] text-slate-300 py-2.5 px-6 md:px-8 border-b border-slate-800">
        <div className="max-w-8xl mx-40 flex justify-between items-center text-sm font-medium">
          <div className="hidden lg:block">
            <p className="text-slate-400">
              <span className="text-[#90D7F5] font-semibold mr-2">New:</span> 
              Empowering your workforce with smart leave management solutions.
            </p>
          </div>
          <div className="flex items-center space-x-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                    <ChevronDown className="h-3 w-3" />
                </button>
                <Link to="#" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                    <CircleQuestionMark className="h-4 w-4" />
                    <span>Support</span>
                </Link>
            </div>
            {!user && (
                <Link to="/login" className="flex items-center space-x-1.5 text-white hover:text-[#90D7F5] transition-colors">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <nav
        className={`w-full transition-all duration-300 border-b border-transparent
        ${
          isSticky
            ? "fixed top-0 left-0 bg-white/80 backdrop-blur-xl shadow-sm border-slate-200 py-3"
            : "bg-white py-5"
        }`}
      >
        <div className="max-w-8xl mx-40 px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/company" className="flex items-center space-x-2 group">
            <div className="p-2 bg-[#222875] rounded-xl group-hover:scale-105 transition-transform">
                <Building className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Leanport <span className="text-[#222875]">HR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "text-[#222875] bg-slate-50"
                        : "text-slate-600 hover:text-[#222875] hover:bg-slate-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to={user ? (user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard") : "/company/get-started"}
              className="px-6 py-2.5 bg-[#222875] text-white rounded-full font-bold text-base hover:bg-[#1a1f5c] hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 active:scale-95"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden
          ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 py-8 flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-lg font-bold p-2 transition-colors ${
                  isActive(item.href) ? "text-[#222875]" : "text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100">
                <Link
                to={user ? (user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard") : "/company/get-started"}
                className="w-full inline-flex justify-center items-center px-6 py-3 bg-[#222875] text-white rounded-xl font-bold text-lg"
                >
                {user ? "Go to Dashboard" : "Get Started Now"}
                </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sticky Spacer */}
      {isSticky && <div className="h-[80px]" />}
    </header>
  );
};

export default CompanyHeader;
