import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Building, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const CompanyHeader = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigation = [
    { name: "Home", href: "/company" },
    { name: "About", href: "/company/about" },
    { name: "Services", href: "/company/services" },
    { name: "Pricing", href: "/company/pricing" },
    { name: "Contact", href: "/company/contact" },
  ];

  const isActive = (href) => {
    if (href === "/company") {
      return location.pathname === "/company" || location.pathname === "/";
    }
    return location.pathname === href;
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/company" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Leanport HR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
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
              >
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          )}

          {(!user || user == undefined) && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/company/get-started">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                >
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/company/get-started"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CompanyHeader;
