import { Building, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const CompanyFooter = () => {
  const currentYear = new Date().getFullYear();

  const openCookieSettings = () => {
    window.dispatchEvent(new Event("leanport-open-cookie-settings"));
  };

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/company/about" },
        { name: "Why Leanport", href: "/company/why-us" },
        { name: "Contact Us", href: "/company/contact" },
        { name: "FAQ", href: "/company/faq" },
      ],
    },
    {
      title: "Products",
      links: [
        { name: "Features", href: "/company/features" },
        { name: "Services", href: "/company/services" },
        { name: "Pricing", href: "/company/pricing" },
        { name: "Get Started", href: "/company/get-started" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/company/privacy-policy" },
        { name: "Terms & Conditions", href: "/company/terms-conditions" },
        { name: "Cookie Policy", href: "/company/cookie-policy" },
        { name: "Security", href: "/company/why-us" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Admin Login", href: "/login" },
        { name: "Feature Guide", href: "/company/features" },
        { name: "Product FAQ", href: "/company/faq" },
        { name: "Support", href: "/company/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-[#2E2E2E] text-slate-300 pt-16 md:pt-24 lg:pt-32 pb-8 border-t border-[#3D3D3D]">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <Link to="/company" className="flex items-center space-x-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C26819]/10 text-[#C26819] border border-[#C26819]/20">
                <Building className="h-6 w-6 text-[#C26819]" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-heading">Leanport HR</span>
            </Link>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-sm font-sans">
              Streamline company setup, employees, leave, salary records, documents,
              notifications, and reports in one focused HR workspace.
            </p>
            <div className="flex space-x-4 sm:space-x-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-[#3D3D3D] hover:bg-[#734425] transition-colors duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:text-[#FAF6F2] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-[#FAF6F2] font-semibold text-lg font-heading">{section.title}</h3>
              <ul className="space-y-4 font-sans">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-[#C26819] transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-y border-[#3D3D3D] py-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="flex items-center space-x-3 break-all">
            <Mail className="h-5 w-5 text-[#C26819] shrink-0" />
            <span>support@leanporthr.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-[#C26819] shrink-0" />
            <span>+1 (555) 000-0000</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-[#C26819] shrink-0" />
            <span>123 Business Ave, Tech City, TC 45678</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 space-y-4 md:space-y-0 text-center md:text-left">
          <p>&copy; {currentYear} Leanport HR. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/company/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/company/terms-conditions" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/company/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
            <button type="button" onClick={openCookieSettings} className="hover:text-white transition-colors">
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;
