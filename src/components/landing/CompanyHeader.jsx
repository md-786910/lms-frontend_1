import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Building, 
  CircleQuestionMark, 
  LogIn, 
  Globe, 
  Menu, 
  X, 
  ChevronDown,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  BarChart3,
  Zap,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { 
      name: "Features", 
      href: "/company/features",
      submenu: [
        { 
          name: "Leave Management", 
          description: "Automate leave requests and approvals with ease.",
          href: "/company/features#leave",
          icon: Calendar,
          color: "text-blue-600",
          bg: "bg-blue-50"
        },
        { 
          name: "Employee Directory", 
          description: "Centralized database for all your workforce info.",
          href: "/company/features#directory",
          icon: Users,
          color: "text-indigo-600",
          bg: "bg-indigo-50"
        },
        { 
          name: "Attendance Tracking", 
          description: "Real-time clock-in/out and shift monitoring.",
          href: "/company/features#attendance",
          icon: Clock,
          color: "text-emerald-600",
          bg: "bg-emerald-50"
        },
        { 
          name: "Performance Analytics", 
          description: "Detailed insights into workforce productivity.",
          href: "/company/features#analytics",
          icon: BarChart3,
          color: "text-amber-600",
          bg: "bg-amber-50"
        },
        { 
          name: "Policy Compliance", 
          description: "Ensure your company stays within legal bounds.",
          href: "/company/features#compliance",
          icon: ShieldCheck,
          color: "text-rose-600",
          bg: "bg-rose-50"
        },
        { 
          name: "Smart Automation", 
          description: "AI-driven workflows for repetitive HR tasks.",
          href: "/company/features#automation",
          icon: Zap,
          color: "text-purple-600",
          bg: "bg-purple-50"
        },
        { 
          name: "Performance Analytics", 
          description: "Detailed insights into workforce productivity.",
          href: "/company/features#analytics",
          icon: BarChart3,
          color: "text-amber-600",
          bg: "bg-amber-50"
        },
        { 
          name: "Policy Compliance", 
          description: "Ensure your company stays within legal bounds.",
          href: "/company/features#compliance",
          icon: ShieldCheck,
          color: "text-rose-600",
          bg: "bg-rose-50"
        },
        { 
          name: "Smart Automation", 
          description: "AI-driven workflows for repetitive HR tasks.",
          href: "/company/features#automation",
          icon: Zap,
          color: "text-purple-600",
          bg: "bg-purple-50"
        },
      ]
    },
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
    setFeaturesOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full relative z-[100]">
      {/* Top Header Row */}
      <div className="bg-[#0f172a] text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-8xl mx-auto xl:mx-60 flex justify-between items-center text-sm font-medium">
          <div className="hidden lg:block">
            <p className="text-slate-400 font-montserrat">
              <span className="text-[#90D7F5] font-semibold mr-2">New:</span> 
              Empowering your workforce with smart leave management solutions.
            </p>
          </div>
          <div className="flex items-center space-x-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center space-x-4 sm:space-x-6">
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                    <Globe className="h-4 w-4" />
                    <span className="xs:inline">English</span>
                    <ChevronDown className="h-3 w-3" />
                </button>
                <Link to="#" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                    <CircleQuestionMark className="h-4 w-4" />
                    <span className="xs:inline">Support</span>
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
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/company" className="flex items-center space-x-2 group shrink-0">
            <div className="p-2 bg-[#222875] rounded-xl group-hover:scale-105 transition-transform">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-montserrat">
                Leanport <span className="text-[#222875]">HR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center">
              {navigation.map((item) => (
                <div key={item.name} className="relative group/nav">
                  {item.submenu ? (
                    <div className="relative">
                        <button
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 font-montserrat
                            ${isActive(item.href) ? "text-[#222875]" : "text-slate-600 hover:text-[#222875] hover:bg-slate-50"}`}
                        >
                            <span>{item.name}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-hover/nav:rotate-180" />
                        </button>
                        
                        {/* Mega Dropdown */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible group-hover/nav:visible opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform scale-95 group-hover/nav:scale-100 z-50">
                            <div className="w-[940px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">
                                    {item.submenu.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        to={sub.href}
                                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group/item border border-transparent hover:border-slate-100 hover:shadow-sm"
                                    >
                                        <div className={`p-3 rounded-lg ${sub.bg} ${sub.color} group-hover/item:scale-110 transition-transform shadow-sm`}>
                                            <sub.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
                                                <span className="font-montserrat">{sub.name}</span>
                                                <ArrowRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-transform" />
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed font-montserrat">{sub.description}</p>
                                        </div>
                                    </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 font-montserrat
                        ${isActive(item.href)
                            ? "text-[#222875] bg-slate-50"
                            : "text-slate-600 hover:text-[#222875] hover:bg-slate-50"
                        }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to={user ? (user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard") : "/company/get-started"}
              className="px-6 py-2.5 bg-[#222875] text-white rounded-full font-bold text-base hover:bg-[#1a1f5c] hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 active:scale-95 whitespace-nowrap font-montserrat"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-900 transition-colors hover:bg-slate-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-50
          ${menuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 py-8 flex flex-col space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name} className="flex flex-col">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setFeaturesOpen(!featuresOpen)}
                      className={`flex items-center justify-between text-lg font-bold p-3 rounded-xl transition-all ${
                        featuresOpen ? "bg-slate-50 text-[#222875]" : "text-slate-600"
                      }`}
                    >
                      <span className="font-montserrat">{item.name}</span>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${featuresOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${featuresOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="grid grid-cols-1 gap-2 pl-4 pr-2 py-2 mt-2">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors border border-transparent hover:border-slate-100"
                          >
                            <div className={`p-2.5 rounded-xl ${sub.bg} ${sub.color} shadow-sm`}>
                              <sub.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-slate-900 font-montserrat">{sub.name}</div>
                                <div className="text-xs text-slate-500 font-montserrat line-clamp-1">{sub.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-lg font-bold p-3 rounded-xl transition-all ${
                      isActive(item.href) ? "bg-slate-50 text-[#222875]" : "text-slate-600 hover:bg-slate-50"
                    } font-montserrat`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-6 border-t border-slate-100 mt-6 pb-2">
                <Link
                to={user ? (user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard") : "/company/get-started"}
                className="w-full inline-flex justify-center items-center px-6 py-4 bg-[#222875] text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all font-montserrat"
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
