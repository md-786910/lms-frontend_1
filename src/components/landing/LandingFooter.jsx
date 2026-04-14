import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 px-6 py-14">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">

        {/* LEFT SIDE - LOGO + INFO */}
        <div className="lg:w-1/3">
          
          {/* LOGO IMAGE */}
          <img
            // src={logo}
            alt="Company Logo"
            className="h-10 mb-4 object-contain"
          />

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Manage employee leaves, track holidays, and streamline your HR
            operations with our modern leave management system.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-lg">
            <FaFacebook className="hover:text-white cursor-pointer transition" />
            <FaTwitter className="hover:text-white cursor-pointer transition" />
            <FaLinkedin className="hover:text-white cursor-pointer transition" />
          </div>
        </div>

        {/* RIGHT SIDE - 3 COLUMNS */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

          {/* Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Login", "About Us", "Support", "Book a Demo"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms & Conditions", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Leave Calculator",
                "Holiday Tracker",
                "Time-Off Planner"
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
}