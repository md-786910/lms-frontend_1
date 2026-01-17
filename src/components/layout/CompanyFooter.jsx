import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const CompanyFooter = () => {
  return (
    <footer className="bg-[#020817] border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/company" className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Leanport <span className="text-blue-500">HR</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              The complete HR operating system for modern businesses. Simplify your workforce management today.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/company/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link to="/company/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link to="/company/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
              <li><Link to="/company/roadmap" className="hover:text-blue-400 transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/company/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/company/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/company/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/company/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>123 Innovation Drive,<br/>Tech Valley, CA 94043</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>+1 (888) 555-0123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>support@leanport.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Leanport HR. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;