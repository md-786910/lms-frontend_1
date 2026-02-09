import { Shield } from "lucide-react";

const LandingFooter = () => (
  <footer className="site-footer text-sm text-muted-foreground border-t border-white/10">
    <div className="max-w-6xl mx-auto py-12 grid gap-10 lg:grid-cols-4">
      <div>
        <p className="text-base font-semibold text-white">PulseHR</p>
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
        <p className="font-semibold text-white">Product</p>
        <ul className="mt-3 space-y-2">
          <li>Employee Directory</li>
          <li>Time & Attendance</li>
          <li>Performance</li>
          <li>Compensation</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-white">Company</p>
        <ul className="mt-3 space-y-2">
          <li>About</li>
          <li>Careers</li>
          <li>Trust & Security</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-white">Support</p>
        <ul className="mt-3 space-y-2">
          <li>Help Center</li>
          <li>API Docs</li>
          <li>Privacy</li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto py-6 flex flex-col gap-4 border-t border-white/5 text-white/60 text-xs md:flex-row md:items-center md:justify-between">
      <p>(c) {new Date().getFullYear()} PulseHR. All rights reserved.</p>
      <div className="flex flex-wrap gap-6">
        <span>Terms</span>
        <span>Privacy</span>
        <span>Security</span>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
