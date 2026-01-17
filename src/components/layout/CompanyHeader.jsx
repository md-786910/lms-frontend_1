import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  
  const navigation = [
    { name: "Home", href: "/company" },
    { name: "About", href: "/company/about" },
    { name: "Services", href: "/company/services" },
    { name: "Pricing", href: "/company/pricing" },
    { name: "Contact", href: "/company/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => {
    if (href === "/company") {
      return location.pathname === "/company" || location.pathname === "/";
    }
    return location.pathname === href;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-[#020817]/80 backdrop-blur-xl border-slate-800 py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/company" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Leanport <span className="text-blue-500">HR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-bold transition-all duration-200 rounded-full ${
                  isActive(item.href)
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to={
                  user?.role == "employee"
                    ? "/employee/dashboard"
                    : "/admin/dashboard"
                }
              >
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full px-6 shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-bold rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/company/get-started">
                  <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full px-6 transition-all hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#020817] border-b border-slate-800 p-6 shadow-2xl animate-enter">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                    isActive(item.href)
                      ? "text-white bg-blue-600"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-slate-800 mt-4 flex flex-col gap-3">
                {user ? (
                  <Link
                    to={
                      user?.role == "employee"
                        ? "/employee/dashboard"
                        : "/admin/dashboard"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center text-slate-300 hover:text-white hover:bg-white/5 h-12 font-bold rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/company/get-started"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold h-12 rounded-xl">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CompanyHeader;
