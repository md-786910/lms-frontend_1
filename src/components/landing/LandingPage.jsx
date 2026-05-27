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
  Bubbles,
  Users,
  Workflow,
} from "lucide-react";

const productStats = [
  { value: "3-step", label: "company onboarding" },
  { value: "Role-based", label: "admin and employee portals" },
  { value: "Realtime", label: "notifications and activity" },
];

const featureCards = [
  {
    icon: CalendarCheck,
    title: "Leave workflows",
    description:
      "Employees apply for leave, admins approve or reject with reasons, and balances update automatically after approval.",
  },
  {
    icon: Users,
    title: "Employee records",
    description:
      "Manage profiles, addresses, personal information, documents, salary details, leave balances, suspension, and reactivation.",
  },
  {
    icon: CircleDollarSign,
    title: "Salary operations",
    description:
      "Import current-month salaries, review salary history, mark paid records, and generate downloadable salary slips.",
  },
  {
    icon: FolderCheck,
    title: "Document management",
    description:
      "Upload employee files, attach document categories, retrieve records, and keep identity and certificate data organized.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Socket.IO and stored notifications keep admins and employees informed about leave requests, approvals, and rejections.",
  },
  {
    icon: Settings2,
    title: "Company settings",
    description:
      "Configure departments, designations, leave types, document categories, currencies, prefixes, and company profile data.",
  },
];

const workflowSteps = [
  {
    title: "Create the company",
    text: "Register the business, first admin, default departments, designations, currencies, leave types, and document categories.",
  },
  {
    title: "Invite employees",
    text: "Add employees, generate employee numbers, send password setup emails, and initialize leave balances.",
  },
  {
    title: "Run HR operations",
    text: "Handle leave, payroll, salary slips, reports, notifications, activity logs, and employee self-service from one portal.",
  },
];

const rolePanels = [
  {
    title: "Admin workspace",
    icon: ShieldCheck,
    items: [
      "Dashboard metrics and recent activity",
      "Employee management and leave review",
      "Payroll history and salary slip generation",
      "Settings for policies and organization structure",
    ],
  },
  {
    title: "Light admin access",
    icon: LockKeyhole,
    items: [
      "Uses the protected admin route group",
      "Company-scoped operational access",
      "Created and removed by full admins",
      "Works with the same login/session system",
    ],
  },
  {
    title: "Employee self-service",
    icon: Building2,
    items: [
      "Leave balances and request history",
      "Profile, documents, and salary information",
      "Salary slip download for paid records",
      "Realtime and stored notifications",
    ],
  },
];

const comparisonRows = [
  ["Leave requests", "Email threads and manual sheet updates", "Tracked requests, status, reasons, and balance changes"],
  ["Payroll records", "Separate formulas and exported files", "Salary profiles, history, paid status, and PDF slips"],
  ["Employee files", "Scattered folders and unclear categories", "Uploaded files attached to employee document categories"],
  ["Permissions", "Shared access with weak ownership", "Admin, light admin, and employee protected route groups"],
  ["Reporting", "Manual monthly summaries", "Dashboard metrics, CSV download, and email report support"],
];

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-950">
      <section className="relative overflow-hidden bg-[#f8fbff]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#90D7F5] to-transparent" />
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-16 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#90D7F5]/50 bg-white px-4 py-2 text-sm font-semibold text-[#222875] shadow-sm">
                <Bubbles className="h-4 w-4" />
                Built for leave, payroll, documents, and employee self-service
              </div>

              <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
                A cleaner way to run everyday HR operations.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Leanport HR brings company onboarding, employee administration, leave approvals,
                salary handling, documents, dashboards, and notifications into one focused system.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/company/get-started"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#222875] px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-100 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1a1f5c]"
                >
                  Start company setup
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:border-[#222875] hover:text-[#222875]"
                >
                  Login to portal
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {productStats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-lg font-bold text-[#222875]">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
                <div className="rounded-3xl bg-[#0f172a] p-5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <div className="text-sm text-slate-400">Admin dashboard</div>
                      <div className="mt-1 text-xl font-bold text-white">May operations</div>
                    </div>
                    <div className="rounded-full bg-[#90D7F5] px-3 py-1 text-xs font-bold text-[#222875]">
                      Live
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-5">
                    {[
                      ["Pending leaves", "12", CalendarCheck],
                      ["Active employees", "148", Users],
                      ["Pending payroll", "18", CircleDollarSign],
                      ["Unread alerts", "7", Bell],
                    ].map(([label, value, Icon]) => (
                      <div key={label} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 transition duration-300 hover:bg-white/12">
                        <Icon className="h-5 w-5 text-[#90D7F5]" />
                        <div className="mt-4 text-2xl font-bold text-white">{value}</div>
                        <div className="mt-1 text-xs text-slate-400">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Leave requests</div>
                        <div className="text-xs text-slate-500">Approval queue</div>
                      </div>
                      <BarChart3 className="h-5 w-5 text-[#222875]" />
                    </div>
                    <div className="space-y-3">
                      {["Sick Leave", "Earned Leave", "Casual Leave"].map((leave, index) => (
                        <div key={leave} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{leave}</div>
                            <div className="text-xs text-slate-500">Employee request #{index + 1}</div>
                          </div>
                          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            Review
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#222875]">Product modules</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Exact workflows your system already supports.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The homepage highlights implemented product areas: onboarding, employee data,
              leave, salary, documents, reports, notifications, and configurable settings.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#90D7F5] hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222875] text-white transition duration-300 group-hover:bg-[#90D7F5] group-hover:text-[#222875]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-[#f8fbff] py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#222875]">Operating flow</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                From signup to monthly HR reporting.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Leanport HR is built around the real company lifecycle: setup, invite,
                operate, report, and keep every role informed.
              </p>
            </div>

            <div className="grid gap-4">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#222875] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-widest text-[#222875]">Role-based access</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Separate portals without scattered tools.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {rolePanels.map((role) => (
              <div key={role.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eefaff] text-[#222875]">
                    <role.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{role.title}</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {role.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className="bg-[#0f172a] py-20 sm:py-24 text-white">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#90D7F5] text-[#222875]">
                <Workflow className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Replace fragmented HR tracking with an auditable system.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Spreadsheets can hold data, but Leanport HR adds controlled access,
                employee workflows, salary records, documents, notifications, and dashboard visibility.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
              {comparisonRows.map(([area, manual, leanport], index) => (
                <div key={area} className={`grid gap-4 p-5 sm:grid-cols-[0.55fr_1fr_1fr] ${index !== comparisonRows.length - 1 ? "border-b border-slate-200" : ""}`}>
                  <div className="font-bold text-slate-950">{area}</div>
                  <div className="text-sm leading-6 text-slate-500">{manual}</div>
                  <div className="text-sm font-semibold leading-6 text-[#222875]">{leanport}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-[#222875] px-6 py-12 text-center text-white shadow-2xl shadow-indigo-200 sm:px-12">
            <FileText className="mx-auto h-10 w-10 text-[#90D7F5]" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Set up your company and start with real HR data.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#CBEFFF]">
              Create the company, configure defaults, invite employees, and begin managing
              leave, payroll, documents, reports, and notifications from the first workspace.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/company/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#222875] transition duration-300 hover:-translate-y-0.5 hover:bg-[#CBEFFF]"
              >
                Get started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-base font-bold text-white transition duration-300 hover:bg-white/10"
              >
                Open existing portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
