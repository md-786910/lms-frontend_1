import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building, CircleQuestionMark, LogIn, Globe } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useAuth();

  const navigation = [
    // { name: "Home", href: "/company" },
    { name: "Features", href: "/company/features" },
    { name: "Services", href: "/company/services" },
    { name: "Pricing", href: "/company/pricing" },
    { name: "Why Us", href: "/company/why-us" },
  ];

  const isActive = (href) => {
    if (href === "/company") {
      return location.pathname === "/company" || location.pathname === "/";
    }
    return location.pathname === href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <div className="bg-white">
      {/* Top Bar */}
      <div className="h-[56px] bg-[#0f172a] flex items-center justify-end px-6 py-1 md:px-8 md:py-2">
        <div className="flex gap-1 md:gap-1">
          <Link to="#" className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]">
            <span className="text-[16px] md:text-[16px] font-Poppins text-white font-semibold">English</span>
            <Globe className="h-4 w-4 text-white mb-1" />
          </Link>
          <Link to="#" className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]">
            <span className="text-[16px] md:text-[16px] font-Poppins text-white font-semibold">Support</span>
            <CircleQuestionMark className="h-4 w-4 text-white mb-1" />
          </Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]">
            <span className="text-[16px] md:text-[16px] font-Poppins text-white font-semibold">LogIn</span>
            <LogIn className="h-4 w-4 text-white mb-1" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <div
        className={`w-full z-50 transition-all duration-300
        ${
          isSticky
            ? "fixed top-0 left-0 bg-white/70 backdrop-blur-lg shadow-md"
            : "bg-white"
        }`}
      >
        <div
          className={`bg-[#FFFFFF] flex items-center justify-between max-w-8xl mx-auto px-6 md:px-8 md:py-2 py-1 transition-all duration-300
          ${isSticky ? "h-[70px]" : "h-[85px]"}`}
        >
          {/* Logo */}
          <Link to="/company" className="flex items-center space-x-2">
            <Building className="h-6 w-6" />
            <span className="text-2xl font-bold">Leanport HR</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px] ${
                    isActive(item.href)
                      ? "text-[18px] md:text-[18px] font-Poppins text-[#212529] font-semibold border-b-2 border-[#90D7F5]"
                      : "text-[18px] md:text-[18px] font-Poppins text-[#212529] font-semibold"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to={
                    user?.role == "employee"
                      ? "/employee/dashboard"
                      : "/admin/dashboard"
                  }
                  className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]"
                >
                  <div className="bg-[#222875] text-[#CBEFFF] hover:bg-[#172098] px-6 py-2 rounded-full text-[18px] md:text-[18px] font-Poppins font-semibold">Go to Dashboard</div>
                </Link>
              </div>
            )}

            {(!user || user == undefined) && (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/company/get-started" className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]">
                  <div className="bg-[#222875] text-[#CBEFFF] hover:bg-[#172098] px-6 py-2 rounded-full text-[18px] md:text-[18px] font-Poppins font-semibold">Get Started</div>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-slate-800 transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-white/60 backdrop-blur-md
          ${menuOpen ? "max-h-auto py-1" : "max-h-0"}`}
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-2 py-1 my-[6px] mr-[24px] ${
                    isActive(item.href)
                      ? "text-[18px] md:text-[18px] font-Poppins text-[#212529] font-semibold border-b-2 border-[#90D7F5]"
                      : "text-[18px] md:text-[18px] font-Poppins text-[#212529] font-semibold"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {user || user !== undefined ? (
                <Link
                  to={
                    user?.role == "employee"
                      ? "/employee/dashboard"
                      : "/admin/dashboard"
                  }
                  className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]"
                >
                  <div className="bg-[#222875] text-[#CBEFFF] hover:bg-[#172098] px-6 py-2 rounded-full text-[18px] md:text-[18px] font-Poppins font-semibold">Go to Dashboard</div>
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link
                    to="/company/get-started"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-2 py-1 my-[9.6px] mr-[24px]"
                  >
                    <div className="bg-[#222875] text-[#CBEFFF] hover:bg-[#172098] px-6 py-2 rounded-full text-[18px] md:text-[18px] font-Poppins font-semibold">Get Started</div>
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      {isSticky && <div className="h-[70px]" />}
    </div>
    </>
  );
}
export default CompanyHeader;