import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Users,
  FolderCheck,
  Bell,
  Settings2,
  LockKeyhole,
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";

export const FeaturesBento = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#F5ECE4]/60 text-stone-900 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C26819]/10 px-3.5 py-1 text-xs font-semibold text-[#C26819] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#C26819]" />
            Core Product Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
            Everything your team needs to manage HR smoothly.
          </h2>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            From remote work verification and automatic leave carry-forward to encrypted payslips—designed to be simple, fast, and stress-free.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Featured - Proof of Work (2 cols on lg) */}
          <div className="lg:col-span-2 rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#734425] text-white flex items-center justify-center shadow-md shadow-[#734425]/20 group-hover:bg-[#C26819] transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#C26819] uppercase tracking-wider block">
                      Featured Capability
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                      Proof of Work & Remote Team Audits
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Audit Ready
                </span>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                Keep hybrid and remote work completely transparent. Employees attach proofs (screenshots, pull requests, files, deliverables) for remote shifts or overtime. Managers review and approve in seconds.
              </p>

              {/* Visual Preview */}
              <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                  <span className="font-semibold text-stone-800">Submission: Weekend API Deployment</span>
                  <span className="text-emerald-700 font-semibold">Approved • 5.5 hours OT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Type</span>
                    <span className="font-medium text-stone-800">Overtime Verification</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Attachments</span>
                    <span className="font-medium text-stone-800">2 Verified Files</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Sync Status</span>
                    <span className="font-medium text-emerald-600">Added to Payslip</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#734425]">
              <span>Eliminates timesheet disputes</span>
              <Link to="/company/features" className="hover:text-[#C26819] flex items-center gap-1">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Smart Carry-Forward Logic */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#C26819] text-white flex items-center justify-center shadow-md shadow-[#C26819]/25 mb-5">
                <CalendarCheck className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-bold text-[#734425] uppercase tracking-wider block">
                Automatic Calculations
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                1.5 Days/Month Leave Rollover
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">
                Never calculate leave balances manually again. The system credits 1.5 days every month, rolls forward unused days, and automatically applies standard salary cuts if availed days exceed balance.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700">
                Formula: Available = 1.5 + Previous Unused Days
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Sick, Casual & Earned leave</span>
              <span className="font-semibold text-emerald-700">Zero Math Errors</span>
            </div>
          </div>

          {/* Card 3: One-Click PDF Salary Slips */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#734425] text-white flex items-center justify-center shadow-md shadow-[#734425]/20 mb-5">
                <CircleDollarSign className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-bold text-[#C26819] uppercase tracking-wider block">
                1-Click Payroll
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Automated PDF Payslips
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">
                Import current-month salary records with a single click. The platform automatically generates clean, encrypted PDF salary slips for employees to view and download.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Multi-Currency (USD, INR, EUR)</span>
              <span className="font-semibold text-[#734425]">Instant Download</span>
            </div>
          </div>

          {/* Card 4: Cloud Document Vault */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-stone-800 text-white flex items-center justify-center shadow-md mb-5">
                <FolderCheck className="w-5 h-5 text-[#E88F44]" />
              </div>

              <span className="text-[11px] font-bold text-[#734425] uppercase tracking-wider block">
                Organized Compliance
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Secure Document Vault
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">
                Upload up to 10 MB files per document. Keep Government IDs, Tax records, Degrees, and signed agreements safely organized in categorized folders with preview support.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Categorized & Encrypted</span>
              <span className="font-semibold text-stone-700">10 MB Uploads</span>
            </div>
          </div>

          {/* Card 5: Real-Time Notifications */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#C26819] text-white flex items-center justify-center shadow-md shadow-[#C26819]/25 mb-5">
                <Bell className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-bold text-[#734425] uppercase tracking-wider block">
                Instant Updates
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Real-Time Push Alerts
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">
                Instant alerts for leave requests, approvals, payslips, and company announcements. Staff and admins receive in-app popups and email confirmations simultaneously.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>In-app alerts + Email delivery</span>
              <span className="font-semibold text-emerald-700">Instant Sync</span>
            </div>
          </div>

          {/* Card 6: 3-Tier Roles (Wide Card) */}
          <div className="lg:col-span-2 rounded-3xl border border-stone-800 bg-[#2E2E2E] text-white p-7 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#C26819] text-white flex items-center justify-center shadow-md shadow-[#C26819]/30">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#C26819] uppercase tracking-wider block">
                    Security & Access
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    3-Tier Role Permissions
                  </h3>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                Clear separation of responsibilities. Secure login sessions ensure users only see and edit what is relevant to their role.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-xs text-[#E88F44]">Company Admin</div>
                  <p className="text-xs text-stone-400 mt-1">
                    Company setup, employee management, salary slips, and policies.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-xs text-stone-200">Light Admin</div>
                  <p className="text-xs text-stone-400 mt-1">
                    Departmental review, leave approvals, without master settings changes.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-xs text-emerald-400">Employee Portal</div>
                  <p className="text-xs text-stone-400 mt-1">
                    Apply for leave, view salary slips, clock in/out, and upload proofs.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span>Secure password encryption & token sessions</span>
              <span className="font-semibold text-white">Role Protected</span>
            </div>
          </div>

          {/* Card 7: Prefix-Based Auto-Employee Codes */}
          <div className="rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#734425] text-white flex items-center justify-center shadow-md shadow-[#734425]/20 mb-5">
                <Users className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-bold text-[#C26819] uppercase tracking-wider block">
                Auto Numbering
              </span>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                Custom Staff ID Codes
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed mt-2.5">
                Set department prefixes (like <span className="font-mono font-bold text-[#734425]">ENG-</span> or <span className="font-mono font-bold text-[#734425]">HR-</span>) to automatically assign clean, institutional employee numbers upon onboarding.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Bulk prefix customization</span>
              <span className="font-semibold text-[#734425]">Clean Records</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBento;
