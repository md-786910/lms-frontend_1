import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  Download,
  Building,
  Check,
  TrendingUp,
  FolderLock,
  Eye,
  RefreshCw,
  Zap,
} from "lucide-react";

export const ProductSimulator = () => {
  const [activeTab, setActiveTab] = useState("pow");

  // Tab 1: Proof of Work State
  const [powType, setPowType] = useState("remote");
  const [powTitle, setPowTitle] = useState("Quarterly Financial Report & API Integration");
  const [powHours, setPowHours] = useState("6.5");
  const [powStatus, setPowStatus] = useState("approved"); // pending, approved, rejected
  const [powAttachments, setPowAttachments] = useState([
    { name: "task_completion_screenshot.png", size: "1.2 MB", type: "Screenshot" },
    { name: "signed_deliverable.pdf", size: "480 KB", type: "Document" },
  ]);

  // Tab 2: Leave & Carry Forward State
  const [monthlyEntitlement, setMonthlyEntitlement] = useState(1.5);
  const [previousCarryForward, setPreviousCarryForward] = useState(1.0);
  const [leaveAvailed, setLeaveAvailed] = useState(2.0);

  // Leave calculations based on formula:
  // Available = Monthly + Previous
  // Deduction = Max(0, Availed - Available)
  // Remaining = Max(0, Available - Availed)
  const availableLeave = Number((monthlyEntitlement + previousCarryForward).toFixed(1));
  const leaveDeduction = Number(Math.max(0, leaveAvailed - availableLeave).toFixed(1));
  const remainingLeave = Number(Math.max(0, availableLeave - leaveAvailed).toFixed(1));

  // Tab 3: Payroll Calculator State
  const [baseSalary, setBaseSalary] = useState(65000);
  const [allowance, setAllowance] = useState(12000);
  const [bonus, setBonus] = useState(5000);
  const [currency, setCurrency] = useState("USD");
  const [isGeneratingSlip, setIsGeneratingSlip] = useState(false);
  const [slipGenerated, setSlipGenerated] = useState(false);

  const totalDeductions = Math.round(baseSalary * 0.05 + leaveDeduction * (baseSalary / 30));
  const netPayable = Math.max(0, baseSalary + allowance + bonus - totalDeductions);

  // Tab 4: Attendance Timer State
  const [clockedIn, setClockedIn] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(24785); // ~6h 53m

  useEffect(() => {
    let interval = null;
    if (clockedIn) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [clockedIn]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Tab 5: Employee Profile Section
  const [profileTab, setProfileTab] = useState("documents");
  const [employeeStatus, setEmployeeStatus] = useState("active");

  const tabs = [
    {
      id: "pow",
      name: "Proof of Work",
      badge: "Featured",
      icon: ShieldCheck,
      shortDesc: "Remote & Overtime Audit",
    },
    {
      id: "leave",
      name: "Leave Rollover",
      badge: "1.5/mo Rule",
      icon: CalendarCheck,
      shortDesc: "Auto Carry-Forward",
    },
    {
      id: "payroll",
      name: "Payroll & Slips",
      badge: "1-Click PDF",
      icon: CircleDollarSign,
      shortDesc: "Encrypted Payslips",
    },
    {
      id: "attendance",
      name: "Time & Attendance",
      badge: "Live Clock",
      icon: Clock,
      shortDesc: "Work Hours Tracker",
    },
    {
      id: "dossier",
      name: "Employee 360°",
      badge: "Secure Vault",
      icon: Users,
      shortDesc: "Documents & Profiles",
    },
  ];

  return (
    <div className="w-full font-sans">
      {/* Friendly Guide Pill */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C26819]/10 text-[#C26819] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C26819]" />
          Interactive Demo — Click tabs below to test live features:
        </span>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white border border-stone-200/90 max-w-4xl mx-auto shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#734425] text-white shadow-md shadow-[#734425]/20 font-semibold"
                  : "bg-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#E88F44]" : "text-stone-500"}`} />
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? "bg-[#C26819] text-white"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulator Display Card */}
      <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-stone-200/40 relative">
        {/* ========================================================= */}
        {/* TAB 1: PROOF OF WORK SIMULATOR                            */}
        {/* ========================================================= */}
        {activeTab === "pow" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C26819] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  Remote & Overtime Verification Workflow
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Proof of Work & Evidence Approval
                </h3>
                <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  Employees submit work proofs (screenshots, code links, or deliverables) for remote work or overtime. Managers review and approve in a single click.
                </p>
              </div>

              {/* Status Simulation Toggle */}
              <div className="flex items-center gap-1.5 p-1.5 bg-stone-50 rounded-xl border border-stone-200 shrink-0">
                <span className="text-xs font-medium text-stone-500 px-2">
                  Preview Status:
                </span>
                {["pending", "approved", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPowStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      powStatus === st
                        ? st === "approved"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : st === "pending"
                          ? "bg-[#C26819] text-white shadow-sm"
                          : "bg-rose-600 text-white shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Friendly Employee Submission Form */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-stone-200/80 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                    <span>1. Employee Work Submission</span>
                    <span className="text-stone-400 font-normal">Auto-logged: Today, 16:30</span>
                  </div>

                  {/* Work Type Selection */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Work Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "remote", label: "Remote Day" },
                        { id: "overtime", label: "Overtime (OT)" },
                        { id: "special", label: "Special Project" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setPowType(t.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                            powType === t.id
                              ? "bg-[#734425] text-white shadow-sm font-semibold"
                              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Task Description & Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Task Summary / Completed Goal
                      </label>
                      <input
                        type="text"
                        value={powTitle}
                        onChange={(e) => setPowTitle(e.target.value)}
                        className="w-full text-xs font-normal bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#734425]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Time Logged
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={powHours}
                          onChange={(e) => setPowHours(e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-[#734425] focus:outline-none focus:border-[#734425]"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-stone-400 font-medium">
                          hours
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Evidence */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Attached Proof / Evidence (Up to 10 MB)
                    </label>
                    <div className="border border-dashed border-[#C26819]/50 bg-white rounded-xl p-3.5 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5 text-[#C26819] mx-auto mb-1" />
                      <p className="text-xs font-medium text-stone-700">
                        Click or drag files here to attach proof
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Screenshots, PDFs, code exports, or receipts
                      </p>
                    </div>

                    {/* Attached list */}
                    <div className="mt-2.5 space-y-1.5">
                      {powAttachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-[#734425] shrink-0" />
                            <span className="font-medium text-stone-800 truncate">
                              {att.name}
                            </span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                              {att.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {att.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Manager View */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-[#2E2E2E] text-stone-100 border border-stone-700 shadow-lg relative">
                  <div className="flex items-center justify-between pb-3.5 border-b border-stone-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#C26819] text-white flex items-center justify-center font-bold text-xs">
                        HR
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Manager Approval View
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Instant real-time notification
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        powStatus === "approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : powStatus === "pending"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {powStatus === "approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {powStatus === "pending" && <Clock className="w-3.5 h-3.5" />}
                      {powStatus === "rejected" && <AlertCircle className="w-3.5 h-3.5" />}
                      <span className="capitalize">{powStatus}</span>
                    </span>
                  </div>

                  <div className="py-3.5 space-y-2.5 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Submitted by</span>
                      <span className="text-white font-medium">Alexander Wright (ENG-042)</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Work Description</span>
                      <span className="text-stone-200">{powTitle}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Logged Hours</span>
                      <span className="text-white font-semibold">{powHours} hours</span>
                    </div>

                    {powStatus === "approved" && (
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-200 text-xs">
                        <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Approved & Synced to Payroll
                        </p>
                        <p className="text-[11px] text-emerald-300/80 mt-0.5">
                          Overtime hours automatically credited to this month&apos;s payslip.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Manager Action Buttons */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setPowStatus("approved")}
                      className="flex-1 py-2 rounded-xl bg-[#C26819] hover:bg-[#A85712] text-white text-xs font-semibold transition-all shadow-sm"
                    >
                      Approve Work
                    </button>
                    <button
                      onClick={() => setPowStatus("rejected")}
                      className="py-2 px-3 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs font-medium transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5 text-xs text-stone-600">
                  <Zap className="w-4 h-4 text-[#C26819] shrink-0" />
                  <span>Eliminates remote work disputes and keeps full audit transparency.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SMART LEAVE & CARRY-FORWARD SIMULATOR              */}
        {/* ========================================================= */}
        {activeTab === "leave" && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#734425] mb-1">
                <CalendarCheck className="w-4 h-4 text-[#C26819]" />
                Automated Rollover & Deduction Logic
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                Leave Carry-Forward & Deduction Calculator
              </h3>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Employees earn 1.5 leave days each month. Unused days roll forward into the next month. Excess leave is automatically deducted from salary with zero spreadsheet math.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-stone-200/80 space-y-5">
                  <div className="text-xs font-semibold text-stone-800">
                    Adjust Monthly Numbers to Test:
                  </div>

                  {/* Monthly Accrual */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-stone-700">
                      <span>Monthly Leave Entitlement</span>
                      <span className="text-[#734425] font-bold">{monthlyEntitlement} Days</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.5"
                      value={monthlyEntitlement}
                      onChange={(e) => setMonthlyEntitlement(parseFloat(e.target.value))}
                      className="w-full accent-[#734425] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>0.5d</span>
                      <span>Default: 1.5 days/month</span>
                      <span>3.0d</span>
                    </div>
                  </div>

                  {/* Previous Carried Forward */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-stone-700">
                      <span>Unused Days from Previous Month</span>
                      <span className="text-[#C26819] font-bold">{previousCarryForward} Days</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.5"
                      value={previousCarryForward}
                      onChange={(e) => setPreviousCarryForward(parseFloat(e.target.value))}
                      className="w-full accent-[#C26819] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>0.0d</span>
                      <span>Rolled forward</span>
                      <span>4.0d</span>
                    </div>
                  </div>

                  {/* Leave Availed */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-stone-700">
                      <span>Days Taken Off This Month</span>
                      <span className="text-stone-900 font-bold">{leaveAvailed} Days</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={leaveAvailed}
                      onChange={(e) => setLeaveAvailed(parseFloat(e.target.value))}
                      className="w-full accent-stone-800 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>0 Days</span>
                      <span>2.5 Days</span>
                      <span>5.0 Days</span>
                    </div>
                  </div>

                  {/* Simple Explanation */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-semibold text-stone-800 block">How the system calculated this:</span>
                    <div>• Total Available = 1.5 + {previousCarryForward} carried = <strong>{availableLeave} days</strong></div>
                    <div>• Salary Deduction = <strong>{leaveDeduction} days</strong> (if taken &gt; available)</div>
                    <div>• Rolls to Next Month = <strong>{remainingLeave} days</strong></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Output Cards */}
              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Card 1: Total Available */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
                    <span className="text-xs font-medium text-stone-500 block">
                      Total Available
                    </span>
                    <div className="text-2xl font-bold text-[#734425] mt-1">
                      {availableLeave} <span className="text-xs font-normal text-stone-400">days</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {monthlyEntitlement} new + {previousCarryForward} carried
                    </p>
                  </div>

                  {/* Card 2: Availed */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
                    <span className="text-xs font-medium text-stone-500 block">
                      Days Taken
                    </span>
                    <div className="text-2xl font-bold text-stone-900 mt-1">
                      {leaveAvailed} <span className="text-xs font-normal text-stone-400">days</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Approved leave this month
                    </p>
                  </div>

                  {/* Card 3: Deduction */}
                  <div
                    className={`p-4 rounded-2xl border shadow-sm ${
                      leaveDeduction > 0
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    <span className="text-xs font-medium block">
                      Salary Cut
                    </span>
                    <div
                      className={`text-2xl font-bold mt-1 ${
                        leaveDeduction > 0 ? "text-rose-700" : "text-emerald-700"
                      }`}
                    >
                      {leaveDeduction} <span className="text-xs font-normal">days</span>
                    </div>
                    <p className="text-[11px] mt-1">
                      {leaveDeduction > 0
                        ? "Deducted automatically from payslip"
                        : "Zero salary cut (within balance)"}
                    </p>
                  </div>

                  {/* Card 4: Next Month Rollover */}
                  <div className="p-4 rounded-2xl bg-[#734425] text-white shadow-md">
                    <span className="text-xs font-medium text-[#EADCCF] block">
                      Next Month Rollover
                    </span>
                    <div className="text-2xl font-bold text-white mt-1">
                      {remainingLeave} <span className="text-xs font-normal text-stone-300">days</span>
                    </div>
                    <p className="text-[11px] text-[#EADCCF]/80 mt-1">
                      Carried forward automatically
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                  <span>✨ Saves HR 4+ hours every month on manual leave adjustments.</span>
                  <span className="font-semibold text-emerald-700">100% Automated</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: AUTOMATED PAYROLL & PDF SLIP SIMULATOR             */}
        {/* ========================================================= */}
        {activeTab === "payroll" && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C26819] mb-1">
                <CircleDollarSign className="w-4 h-4" />
                Automated Payroll & Encrypted PDF Payslips
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                1-Click Monthly Salary Batch & PDF Generation
              </h3>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Maintain base salaries, allowances, and bonuses. When imported, the system calculates deductions, prepares salary histories, and generates downloadable PDF payslips.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Simple Salary Inputs */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-stone-200/80 space-y-3.5">
                  <div className="text-xs font-semibold text-stone-800">
                    Salary Profile Settings
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Currency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["USD", "INR", "EUR"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCurrency(c)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-semibold ${
                            currency === c
                              ? "bg-[#734425] text-white shadow-sm"
                              : "bg-white text-stone-600 border border-stone-200"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Base Salary ({currency})
                    </label>
                    <input
                      type="number"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Allowances
                      </label>
                      <input
                        type="number"
                        value={allowance}
                        onChange={(e) => setAllowance(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Bonus / Incentives
                      </label>
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                      />
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Gross Total:</span>
                      <span className="font-semibold">{currency} {(baseSalary + allowance + bonus).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Deductions:</span>
                      <span className="font-semibold">- {currency} {totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#734425] font-bold text-sm pt-1 border-t border-dashed border-stone-200">
                      <span>Net Payable:</span>
                      <span>{currency} {netPayable.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsGeneratingSlip(true);
                      setTimeout(() => {
                        setIsGeneratingSlip(false);
                        setSlipGenerated(true);
                      }, 700);
                    }}
                    disabled={isGeneratingSlip}
                    className="w-full py-2.5 rounded-xl bg-[#C26819] hover:bg-[#A85712] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isGeneratingSlip ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Rendering Payslip PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        Generate PDF Payslip Preview
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Clean PDF Payslip Mockup */}
              <div className="lg:col-span-7">
                <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-md text-xs text-stone-800 space-y-4">
                  {/* Slip Header */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#734425]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#734425] text-white font-bold flex items-center justify-center text-xs">
                        LP
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">
                          LeanPort Enterprise Payslip
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Period: May 2026 • Confidential
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Status: Paid
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Employee</span>
                      <span className="font-semibold text-stone-900">Alexander Wright</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Staff Code</span>
                      <span className="font-semibold text-stone-900 font-mono">ENG-042</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Department</span>
                      <span className="font-semibold text-stone-900">Engineering</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Designation</span>
                      <span className="font-semibold text-stone-900">Tech Lead</span>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="border border-stone-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 font-semibold text-[11px] border-b border-stone-200">
                        <tr>
                          <th className="p-2">Earnings</th>
                          <th className="p-2 text-right">Amount</th>
                          <th className="p-2 pl-3">Deductions</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-[11px]">
                        <tr>
                          <td className="p-2">Basic Salary</td>
                          <td className="p-2 text-right font-mono">{currency} {baseSalary.toLocaleString()}</td>
                          <td className="p-2 pl-3">Tax & Statutory</td>
                          <td className="p-2 text-right font-mono text-stone-500">{currency} {Math.round(baseSalary * 0.05).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-2">Allowances</td>
                          <td className="p-2 text-right font-mono">{currency} {allowance.toLocaleString()}</td>
                          <td className="p-2 pl-3">Leave Deductions</td>
                          <td className="p-2 text-right font-mono text-stone-500">
                            {currency} {Math.round(leaveDeduction * (baseSalary / 30)).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Net Pay Callout */}
                  <div className="p-3.5 rounded-xl bg-[#FAF6F2] border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        Net Disbursed Amount
                      </div>
                      <div className="text-lg font-bold text-[#734425]">
                        {currency} {netPayable.toLocaleString()}
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#734425] text-white text-xs font-semibold hover:bg-[#5D361D] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LIVE ATTENDANCE & TIME LOGS                        */}
        {/* ========================================================= */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#734425] mb-1">
                <Clock className="w-4 h-4 text-[#C26819]" />
                Live Attendance & Work Hours Logging
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                Live Clock In/Out & Shift Summary
              </h3>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Employees can clock in with one click. Work duration runs live, sessions are tracked, and monthly attendance reports are generated automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Live Running Clock */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-[#2E2E2E] text-white text-center border border-stone-700 shadow-lg">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-stone-200 text-xs font-medium mb-3">
                    <span className={`w-2 h-2 rounded-full ${clockedIn ? "bg-emerald-400 animate-ping" : "bg-stone-500"}`} />
                    {clockedIn ? "Shift in Progress" : "Shift Ended"}
                  </span>

                  {/* Running Timer */}
                  <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white my-3">
                    {formatTimer(timerSeconds)}
                  </div>
                  <p className="text-xs text-stone-400 mb-5">
                    Clocked in today at 09:30 AM
                  </p>

                  {/* Action Toggle Button */}
                  <button
                    onClick={() => setClockedIn(!clockedIn)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm ${
                      clockedIn
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-[#C26819] hover:bg-[#A85712] text-white"
                    }`}
                  >
                    {clockedIn ? "Clock Out for the Day" : "Clock In Now"}
                  </button>
                </div>
              </div>

              {/* Right Column: Monthly Attendance Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-stone-200/80 space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                    <span>May Attendance Overview</span>
                    <span className="text-stone-500 font-normal">24 Working Days</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
                      <div className="text-xl font-bold text-stone-900">22</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">Days Present</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
                      <div className="text-xl font-bold text-emerald-600">0</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">Unexcused</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
                      <div className="text-xl font-bold text-amber-600">2</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">Half-Days</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
                      <div className="text-xl font-bold text-[#734425]">8.5h</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">Overtime</div>
                    </div>
                  </div>

                  {/* Attendance Log Items */}
                  <div className="space-y-1.5 pt-1">
                    {[
                      { date: "Yesterday, May 22", in: "09:30 AM", out: "06:45 PM", status: "Present (9h 15m)" },
                      { date: "Wednesday, May 21", in: "09:28 AM", out: "06:30 PM", status: "Present (9h 02m)" },
                    ].map((log, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-stone-800">{log.date}</div>
                          <div className="text-[11px] text-stone-400">
                            {log.in} → {log.out}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: EMPLOYEE 360° DOSSIER & DOCUMENT VAULT             */}
        {/* ========================================================= */}
        {activeTab === "dossier" && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#734425] mb-1">
                <Users className="w-4 h-4 text-[#C26819]" />
                Employee 360° & Document Storage
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                Workforce Records & Secure Documents
              </h3>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Centralized profile details, verified document uploads, salary records, and department prefix employee codes.
              </p>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-stone-100">
              {[
                { id: "basic", label: "Basic Details" },
                { id: "documents", label: "Uploaded Documents (5)" },
                { id: "salary", label: "Salary History" },
                { id: "leave", label: "Leave Entitlements" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setProfileTab(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    profileTab === sub.id
                      ? "bg-[#734425] text-white shadow-sm font-semibold"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {sub.label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Status:</span>
                <button
                  onClick={() =>
                    setEmployeeStatus(employeeStatus === "active" ? "suspended" : "active")
                  }
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    employeeStatus === "active"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {employeeStatus === "active" ? "Active" : "Suspended"}
                </button>
              </div>
            </div>

            {/* Tab Body */}
            {profileTab === "documents" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: "National ID / Passport", size: "2.4 MB", category: "Government ID" },
                  { name: "Tax Number (PAN)", size: "1.1 MB", category: "Tax Compliance" },
                  { name: "Degree Certificate", size: "3.8 MB", category: "Education" },
                  { name: "Signed Employment Offer", size: "850 KB", category: "HR Agreement" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-[#734425] bg-[#734425]/10 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <h5 className="text-xs font-semibold text-stone-800">{doc.name}</h5>
                      <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                        Verified • {doc.size}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium">
                      <button className="text-[#734425] hover:underline flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button className="text-stone-500 hover:text-stone-800 flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "basic" && (
              <div className="p-5 rounded-2xl bg-white border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Full Name</span>
                  <span className="font-semibold text-stone-900">Alexander Wright</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Staff ID</span>
                  <span className="font-semibold text-[#734425] font-mono">ENG-042</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Department</span>
                  <span className="font-semibold text-stone-900">Engineering</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Designation</span>
                  <span className="font-semibold text-stone-900">Tech Lead</span>
                </div>
              </div>
            )}

            {profileTab === "salary" && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-stone-800 pb-2 border-b border-stone-200">
                  <span>Month</span>
                  <span>Gross</span>
                  <span>Deductions</span>
                  <span>Net Paid</span>
                  <span>Payslip</span>
                </div>
                {[
                  { month: "April 2026", gross: "$6,500", ded: "$325", net: "$6,175" },
                  { month: "March 2026", gross: "$6,500", ded: "$325", net: "$6,175" },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 border-b border-stone-100 font-mono text-[11px]">
                    <span className="font-sans font-medium text-stone-800">{row.month}</span>
                    <span>{row.gross}</span>
                    <span className="text-rose-600">-{row.ded}</span>
                    <span className="font-semibold text-emerald-700">{row.net}</span>
                    <button className="text-[#734425] hover:underline font-sans">View PDF</button>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "leave" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Sick Leave", total: 12, remaining: 10 },
                  { name: "Casual Leave", total: 10, remaining: 7 },
                  { name: "Earned Leave", total: 18, remaining: 14 },
                ].map((lv, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200">
                    <h5 className="font-semibold text-xs text-[#734425]">{lv.name}</h5>
                    <div className="text-xl font-bold mt-1 text-stone-900">
                      {lv.remaining} <span className="text-xs text-stone-400 font-normal">days remaining</span>
                    </div>
                    <div className="mt-2 text-[11px] text-stone-500">
                      Total Annual Quota: {lv.total} days
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSimulator;
