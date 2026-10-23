import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  FolderCheck,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Check,
  ChevronDown,
  Clock,
  Layers,
  HelpCircle,
  Zap,
} from "lucide-react";
import FeaturesBento from "./FeaturesBento";

const metrics = [
  { value: "1.5 Days / mo", label: "Automatic Leave Rollover" },
  { value: "Proof of Work", label: "Remote & Overtime Audits" },
  { value: "1-Click Payroll", label: "Encrypted PDF Payslips" },
  { value: "3 User Portals", label: "Admin, Manager & Staff" },
];

const roleShowcases = [
  {
    role: "Company Admin",
    badge: "Full Governance",
    desc: "Complete operational control over company profiles, departments, policy rules, and payroll.",
    capabilities: [
      "Company registration, prefix management, & currency defaults",
      "Employee invites, profile management, and status suspension",
      "Leave request approval, rejection with reasons, & custom entries",
      "One-click monthly salary import & encrypted PDF payslips",
      "Executive analytics, monthly CSV reports, & email report delivery",
      "Light admin provisioning and delegation",
    ],
  },
  {
    role: "Light Admin",
    badge: "Delegated Operations",
    desc: "Designed for department heads and assistant HR managers needing operational access without company ownership.",
    capabilities: [
      "Protected admin route group access for daily operations",
      "Review department leave requests and track approvals",
      "Access employee directory and documentation records",
      "Restricted from creating or deleting administrative users",
      "View company-wide attendance and leave trends",
    ],
  },
  {
    role: "Employee Self-Service",
    badge: "Staff Empowerment",
    desc: "A clean, modern portal giving employees full transparency into their leave balances, payslips, and work proofs.",
    capabilities: [
      "Submit Proof of Work with file & screenshot attachments",
      "Apply for leave with real-time balance calculations",
      "Download verified PDF salary slips for paid cycles",
      "Live clock in / clock out with running shift timer",
      "Maintain personal details, address, and view uploaded certificates",
    ],
  },
];

const spreadsheetVsLms = [
  {
    feature: "Remote Work Verification",
    manual: "Scattered across email and chat messages with no audit log",
    leanport: "Upload screenshots & deliverables with manager approval in seconds",
  },
  {
    feature: "Leave Carry-Forward",
    manual: "Broken spreadsheet formulas and monthly manual reconciliation errors",
    leanport: "Automatic 1.5 days/month accrual, rollover, and formula salary deduction",
  },
  {
    feature: "Salary Slip Generation",
    manual: "Manual mail-merge templates prone to confidentiality errors",
    leanport: "One-click generation of encrypted PDF payslips with employee self-download",
  },
  {
    feature: "Access Control & Roles",
    manual: "Shared spreadsheets with uncontrolled editing and privacy risks",
    leanport: "Secure login sessions with isolated Admin, Light Admin, and Employee areas",
  },
  {
    feature: "Employee Documents",
    manual: "Scattered in random Google Drive folders or desktop downloads",
    leanport: "Safe, categorized vault for Government IDs, Tax cards, and Certificates",
  },
];

const faqs = [
  {
    q: "How does the Proof of Work feature verify remote work and overtime?",
    a: "Employees select their task type (Remote Day, Overtime, or Special Project), write a brief summary of what they completed, and attach proof files (screenshots, reports, or deliverables). The submission appears in the manager's review queue with real-time notifications for quick approval. Once approved, overtime hours automatically sync with monthly payroll.",
  },
  {
    q: "How does the 1.5 leave carry-forward work each month?",
    a: "Every active employee automatically accrues 1.5 days on their balance each month. Any unused days carry forward into the following month. If an employee takes more days than their available balance (current entitlement + previous carried-forward days), the system automatically calculates the deduction and reflects it on their payslip.",
  },
  {
    q: "Can employees download salary slips before they are officially paid?",
    a: "No. For audit integrity and financial accuracy, salary slips are only unlocked for employee self-service download after an administrator has reviewed and officially marked the payroll record as Paid.",
  },
  {
    q: "What is the difference between an Admin and a Light Admin?",
    a: "Full Admins have universal control over company settings, billing, and administrator user accounts. Light Admins share the operational workspace to review leaves and manage records, but cannot create or remove other administrative accounts.",
  },
  {
    q: "How are employee documents organized and secured?",
    a: "Files up to 10 MB are securely uploaded into categorized buckets (Government IDs, Tax identifiers, Educational degrees, and HR agreements). Documents are tied directly to the employee record with quick preview and download options.",
  },
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#FAF6F2] text-stone-900 font-sans selection:bg-[#C26819]/20 selection:text-stone-900">
      {/* ========================================================= */}
      {/* 1. HERO SECTION: USER-FRIENDLY, WELCOMING, HIGH-CONTRAST  */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF6F2] to-[#FAF6F2] border-b border-stone-200/80 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#734425]/5 via-[#C26819]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Friendly Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#734425] shadow-sm mb-6 hover:border-[#C26819]/50 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-[#C26819]" />
              <span>New: Proof of Work & Remote Audits Feature Live</span>
            </div>

            {/* Main Headline - Natural Title Case */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
              A simpler, smarter way to run{" "}
              <span className="text-[#734425] underline decoration-[#C26819]/40 decoration-wavy decoration-2">
                HR and payroll.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Manage employee onboarding, 1.5/month leave carry-forward, remote work verification,
              and 1-click PDF salary slips in one friendly platform your team will love using.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/company/get-started"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#734425] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#734425]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5D361D]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 text-[#E88F44]" />
              </Link>
              <Link
                to="/company/features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-50 hover:text-stone-900 shadow-sm"
              >
                <span>Explore Feature Workflows</span>
                <ArrowRight className="h-4 w-4 text-[#C26819]" />
              </Link>
            </div>

            {/* Trust Metrics Pill Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-stone-200 bg-white p-3.5 text-left shadow-sm"
                >
                  <div className="text-lg font-bold text-[#734425]">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-500 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BENTO-GRID FEATURE HIGHLIGHTS                          */}
      {/* ========================================================= */}
      <FeaturesBento />

      {/* ========================================================= */}
      {/* 3. THREE-TIER WORKSPACE ARCHITECTURE (NO TABS)            */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C26819]/10 text-[#C26819] text-xs font-semibold mb-2">
              <LockKeyhole className="w-3.5 h-3.5" />
              Dedicated User Experiences
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Tailored portals for admins, managers, and staff
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600">
              Everyone sees exactly what they need with protected route groups, encrypted sessions, and company-scoped isolation.
            </p>
          </div>

          {/* 3 Roles Side-by-Side (Zero Tabs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleShowcases.map((role) => (
              <div
                key={role.role}
                className="rounded-3xl border border-stone-200 bg-[#FAF6F2] p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#734425]/10 text-[#734425]">
                      {role.badge}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">Protected</span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {role.role}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    {role.desc}
                  </p>

                  <div className="space-y-2.5 text-xs text-stone-700 border-t border-stone-200/80 pt-4">
                    <span className="text-xs font-semibold text-stone-900 block mb-2">
                      Key Capabilities:
                    </span>
                    {role.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C26819] shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200">
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#734425] hover:bg-[#734425] hover:text-white transition-all shadow-sm"
                  >
                    <span>Sign in to {role.role}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. COMPARISON MATRIX: SPREADSHEETS VS LEANPORT HR         */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF6F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#734425]/10 text-[#734425] text-xs font-semibold mb-2">
              <Workflow className="w-3.5 h-3.5 text-[#C26819]" />
              Clear Difference
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Why manual spreadsheets fall short
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600">
              See how Leanport HR saves hours and prevents common payroll and leave mistakes.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="grid grid-cols-12 bg-[#734425] text-white p-4 font-semibold text-xs">
              <div className="col-span-4 sm:col-span-3">Process</div>
              <div className="col-span-4 sm:col-span-4 text-stone-300">Spreadsheets & Email</div>
              <div className="col-span-4 sm:col-span-5 text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E88F44]" />
                Leanport HR Platform
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {spreadsheetVsLms.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 items-center hover:bg-stone-50/70 transition-colors text-xs"
                >
                  <div className="col-span-4 sm:col-span-3 font-semibold text-stone-900">
                    {item.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-stone-500 pr-3 leading-relaxed">
                    {item.manual}
                  </div>
                  <div className="col-span-4 sm:col-span-5 font-medium text-[#734425] leading-relaxed flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item.leanport}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FAQ ACCORDION SECTION                                  */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-white border-y border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#734425]/10 text-[#734425] text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#C26819]" />
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-stone-600 text-sm">
              Answers about leave rollover rules, Proof of Work audits, and privacy.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-stone-200 bg-[#FAF6F2] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-stone-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-200 shrink-0 ${
                      openFaq === index ? "rotate-180 text-[#C26819]" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FRIENDLY, WARM FINAL CTA                               */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF6F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#734425] to-[#5D361D] p-8 sm:p-14 text-center text-white shadow-xl shadow-[#734425]/20 relative overflow-hidden border border-[#8D5531]">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#E88F44]" />
                Easy 3-Step Company Setup
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug">
                Ready to simplify your HR operations?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-stone-200 leading-relaxed">
                Register your business, initialize default departments and leave rules, and invite your team in under 5 minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/company/get-started"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#C26819] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A85712]"
                >
                  <span>Start Free Setup</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
                >
                  Sign in to Portal
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E88F44]" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E88F44]" /> 5-minute setup
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E88F44]" /> Full Proof of Work & Payroll support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
