import { Shield } from "lucide-react";

const LandingFooter = () => (
  <footer className="site-footer text-sm text-muted-foreground border-t border-white/10 bg-[#222875]">
    <div className="max-w-[1580PX] mx-auto py-12 grid gap-10 lg:grid-cols-4">
      <div className="mr-40">
        <p className="text-base font-semibold text-[#CBEFFF] text-[20px] mb-2">PulseHR</p>
        <p className="mt-3 text-muted-foreground">
          Everything you need to run a confident, compliant, and human-centered
          workforce.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
          <Shield className="h-4 w-4" />
          SOC 2 certified platform
        </div>
      </div>
      <div>
        <p className="font-semibold text-[#CBEFFF] text-[20px] mb-2">Product</p>
        <ul className="mt-3 space-y-2">
          <li className="hover:text-[#CBEFFF] cursor-pointer">Employee Directory</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Time & Attendance</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Performance</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Compensation</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-[#CBEFFF] text-[20px] mb-2">Company</p>
        <ul className="mt-3 space-y-2">
          <li className="hover:text-[#CBEFFF] cursor-pointer">About</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Careers</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Trust & Security</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Contact</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-[#CBEFFF] text-[20px] mb-2">Support</p>
        <ul className="mt-3 space-y-2">
          <li className="hover:text-[#CBEFFF] cursor-pointer">Help Center</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">API Docs</li>
          <li className="hover:text-[#CBEFFF] cursor-pointer">Privacy</li>
        </ul>
      </div>
    </div>
    <div className="max-w-[1580px] mx-auto py-6 flex flex-col gap-4 border-t border-white/5 text-white/60 text-xs md:flex-row md:items-center md:justify-between">
      <p>(c) {new Date().getFullYear()} PulseHR. All rights reserved.</p>
      <div className="flex flex-wrap gap-6">
        <span className="hover:text-[#CBEFFF] cursor-pointer">Terms</span>
        <span className="hover:text-[#CBEFFF] cursor-pointer">Privacy</span>
        <span className="hover:text-[#CBEFFF] cursor-pointer">Security</span>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
