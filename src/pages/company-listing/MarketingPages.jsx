import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Cookie,
  Database,
  FileArchive,
  FileLock2,
  FileText,
  FolderCheck,
  HelpCircle,
  KeyRound,
  Layers3,
  LockKeyhole,
  MapPin,
  MailCheck,
  MessageSquare,
  Phone,
  RotateCcw,
  Scale,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Workflow,
} from "lucide-react";

const PageShell = ({ eyebrow, title, description, children, actions = true }) => (
  <div className="bg-white text-slate-950">
    <section className="relative overflow-hidden bg-[#f8fbff]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#90D7F5] to-transparent" />
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#90D7F5]/60 bg-white px-4 py-2 text-sm font-bold text-[#222875] shadow-sm">
            <Sparkles className="h-4 w-4" />
            {eyebrow}
          </div>
          <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>
          {actions && (
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/company/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#222875] px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-100 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1a1f5c]"
              >
                Start company setup
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:border-[#222875] hover:text-[#222875]"
              >
                Open portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
    {children}
  </div>
);

const SectionIntro = ({ eyebrow, title, description, center = false }) => (
  <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-sm font-bold uppercase tracking-widest text-[#222875]">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>}
  </div>
);

const FeatureTile = ({ icon: Icon, title, description, items = [] }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#90D7F5] hover:shadow-xl hover:shadow-slate-200/70">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222875] text-white transition duration-300 group-hover:bg-[#90D7F5] group-hover:text-[#222875]">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
    <p className="mt-3 leading-7 text-slate-600">{description}</p>
    {items.length > 0 && (
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const CTASection = ({ title, description }) => (
  <section className="py-20 sm:py-24">
    <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-[#222875] px-6 py-12 text-center text-white shadow-2xl shadow-indigo-200 sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#CBEFFF]">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/company/get-started"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#222875] transition duration-300 hover:-translate-y-0.5 hover:bg-[#CBEFFF]"
          >
            Get started
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/company/features"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-base font-bold text-white transition duration-300 hover:bg-white/10"
          >
            View features
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const featureGroups = [
  {
    id: "leave",
    icon: CalendarCheck,
    title: "Leave management",
    description: "Company leave types, employee balances, requests, cancellation, approval, rejection reasons, and admin-created leaves.",
    items: ["Overlap validation for approved leaves", "Balance updates after approval", "Email and stored notifications"],
  },
  {
    id: "directory",
    icon: Users,
    title: "Employee administration",
    description: "Employee creation, invite emails, employee numbers, profile sections, suspension, reactivation, and resend invite support.",
    items: ["Basic, address, personal, document, salary, and leave sections", "Department and designation data", "Active and suspended filtering"],
  },
  {
    id: "payroll",
    icon: CircleDollarSign,
    title: "Salary and slips",
    description: "Maintain salary profiles, import current-month salary history, review paid and pending totals, and generate PDF salary slips.",
    items: ["Admin salary dashboard", "Employee salary history", "Download salary slips for paid records"],
  },
  {
    id: "documents",
    icon: FolderCheck,
    title: "Document records",
    description: "Cloudinary-backed uploads, file metadata, document category settings, employee document listing, retrieval, and deletion.",
    items: ["10 MB upload limit support", "Category-based organization", "Employee document association"],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Dashboards and reports",
    description: "Admin and employee dashboards show leave, salary, activity, notification, and workforce metrics for daily operations.",
    items: ["Monthly leave report email", "CSV report download", "Yearly leave summary filters"],
  },
  {
    id: "settings",
    icon: Settings2,
    title: "Company configuration",
    description: "Configure company profile, prefixes, currencies, departments, designations, leave types, and document categories.",
    items: ["Default setup after registration", "Guardrails for used settings", "Company-scoped data"],
  },
];

export const CompanyFeatures = () => (
  <PageShell
    eyebrow="Product features"
    title="Every public feature maps to an implemented workflow."
    description="Leanport HR focuses on practical HR operations: company onboarding, employee records, leave workflows, salary processing, documents, dashboards, notifications, and configurable settings."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Core modules"
          title="Built around the real LMS product surface."
          description="No generic HR-suite promises. These are the areas backed by the current frontend and backend modules."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((feature) => (
            <div id={feature.id} key={feature.id} className="scroll-mt-28">
              <FeatureTile {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#f8fbff] py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionIntro
            eyebrow="Role flow"
            title="Separate workspaces for admins and employees."
            description="The app uses protected route groups and role-aware sessions so each user lands in the right operational workspace."
          />
          <div className="grid gap-4">
            {[
              ["Admin", "Company profile, employee management, leave review, salary generation, settings, reports, notifications."],
              ["Light admin", "Admin-protected access with user management restrictions kept for full admins."],
              ["Employee", "Leave balances, leave requests, salary data, documents, profile data, notifications, and password settings."],
            ].map(([role, text]) => (
              <div key={role} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#222875]">{role}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <CTASection
      title="Start with the modules your HR team already needs."
      description="Register a company, create the first admin, initialize defaults, and begin adding employees into a structured HR workspace."
    />
  </PageShell>
);

const serviceTracks = [
  {
    icon: Building2,
    title: "Company setup",
    description: "A guided three-step signup flow creates the company and first admin account.",
    items: ["Company information", "Admin details", "Password and terms setup"],
  },
  {
    icon: RotateCcw,
    title: "Default initialization",
    description: "After registration, the system initializes useful starting configuration for a new company.",
    items: ["Currencies and departments", "Designations and prefixes", "Default leave and document categories"],
  },
  {
    icon: MailCheck,
    title: "Employee onboarding",
    description: "Admins invite employees through email verification and password creation workflows.",
    items: ["Employee number generation", "Invite and resend invite emails", "Initial leave balance setup"],
  },
  {
    icon: Workflow,
    title: "Operational automation",
    description: "Leanport HR reduces repetitive work in leave approvals, notifications, salary history, and reports.",
    items: ["Leave approval side effects", "Monthly leave reports", "Salary slip generation"],
  },
  {
    icon: FileArchive,
    title: "Record organization",
    description: "Employee documents, salary records, activity logs, and notifications stay attached to the right company and user.",
    items: ["Company-scoped access", "Stored activity records", "File metadata and retrieval"],
  },
  {
    icon: KeyRound,
    title: "Account recovery",
    description: "Public and protected account flows support login, logout, forgot password, reset password, and employee password setup.",
    items: ["JWT sessions", "Email reset links", "Role-aware login"],
  },
];

export const CompanyServices = () => (
  <PageShell
    eyebrow="Services"
    title="Implementation support built into the product workflow."
    description="The service experience is not separate from the application. Leanport HR guides teams from company creation to employee onboarding, leave operations, payroll records, reporting, and account recovery."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="What teams can run"
          title="A practical operating model for HR teams."
          description="These service tracks reflect existing product workflows and avoid unsupported claims about external integrations or backend attendance automation."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceTracks.map((service) => (
            <FeatureTile key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#0f172a] py-20 sm:py-24 text-white">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#90D7F5]">Delivery path</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From registration to repeatable HR operations.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              The product gives admins the setup controls and daily workflow screens needed to operate without spreadsheet handoffs.
            </p>
          </div>
          <div className="grid gap-4">
            {["Configure company defaults", "Invite employees", "Approve leave and send notifications", "Generate salary slips", "Download and email leave reports"].map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#90D7F5] text-sm font-bold text-[#222875]">
                  {index + 1}
                </div>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <CTASection
      title="Move employee setup and HR operations into one workflow."
      description="Use the company onboarding flow to create your workspace and begin adding real employee records."
    />
  </PageShell>
);

const plans = [
  {
    name: "Starter",
    fit: "For small teams formalizing leave and employee records.",
    features: ["Company setup", "Employee profiles and documents", "Leave requests and balances", "Admin and employee portals"],
  },
  {
    name: "Operations",
    fit: "For teams running leave, salary history, reports, and settings together.",
    features: ["Everything in Starter", "Salary profiles and salary history", "PDF salary slip generation", "Monthly leave report email and CSV"],
    highlighted: true,
  },
  {
    name: "Custom",
    fit: "For companies that need tailored rollout support or custom terms.",
    features: ["Company-scoped configuration", "Light admin access model", "Document and setting controls", "Setup and migration discussion"],
  },
];

export const CompanyPricing = () => (
  <PageShell
    eyebrow="Pricing"
    title="Flexible plans for a company-scoped HR workspace."
    description="Pricing is presented around product capability, not unsupported package claims. Choose the setup path that matches how much of Leanport HR your team wants to run from day one."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Plans"
          title="Start with core HR and expand into operations."
          description="All plans are designed around the implemented modules: employee records, leave workflows, salary records, documents, reports, notifications, and settings."
          center
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlighted ? "border-[#222875] bg-[#f8fbff] ring-4 ring-[#90D7F5]/25" : "border-slate-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-6 rounded-full bg-[#222875] px-4 py-1.5 text-xs font-bold text-white">
                  Recommended
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-950">{plan.name}</h3>
              <p className="mt-3 min-h-16 leading-7 text-slate-600">{plan.fit}</p>
              <div className="mt-7 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="text-sm font-bold uppercase tracking-widest text-[#222875]">Contact for pricing</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">Final pricing can follow employee count, rollout needs, and selected modules.</p>
              </div>
              <ul className="mt-7 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/company/get-started"
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition duration-300 ${
                  plan.highlighted ? "bg-[#222875] text-white hover:bg-[#1a1f5c]" : "border border-slate-300 text-slate-900 hover:border-[#222875] hover:text-[#222875]"
                }`}
              >
                Start setup
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#f8fbff] py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Included modules"
          title="The same product foundation across plans."
          description="Each rollout can be configured around the modules your company needs first."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Company onboarding", "Role-based login", "Leave workflows", "Employee profiles", "Document uploads", "Salary records", "Notifications", "Reports and dashboards"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-700 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTASection
      title="Choose the rollout scope that fits your HR process."
      description="Start the company setup flow and build your workspace from the implemented Leanport HR modules."
    />
  </PageShell>
);

const whyPoints = [
  {
    icon: Database,
    title: "Company-scoped data",
    description: "Records are associated with company context across users, employees, leave, salary, settings, notifications, and files.",
  },
  {
    icon: ShieldCheck,
    title: "Clear permission boundaries",
    description: "Frontend route protection and backend authentication separate admin, light admin, and employee access.",
  },
  {
    icon: Bell,
    title: "Realtime and stored communication",
    description: "Socket.IO notifications, persisted notification records, email workflows, and activity logs keep actions traceable.",
  },
  {
    icon: Layers3,
    title: "Operational breadth without clutter",
    description: "Leave, payroll records, documents, settings, and dashboards live in focused modules instead of one overloaded sheet.",
  },
];

export const CompanyWhyUs = () => (
  <PageShell
    eyebrow="Why Leanport HR"
    title="A focused LMS for teams that need structure, not generic HR noise."
    description="Leanport HR is designed around the workflows already present in the product: company setup, employee administration, leave, salary records, documents, notifications, reports, and role-based access."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Decision points"
          title="Why the product fits daily HR operations."
          description="The strongest value is practical: fewer manual updates, clearer ownership, better records, and a portal employees can use directly."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {whyPoints.map((point) => (
            <FeatureTile key={point.title} {...point} />
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#0f172a] py-20 sm:py-24 text-white">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#90D7F5]">Spreadsheet replacement</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A system of record for repetitive HR work.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Instead of sending leave, payroll, document, and employee updates across separate files, teams can run them through one role-aware application.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white text-slate-950">
            {[
              ["Manual tracking", "Shared spreadsheets, email trails, separate folders, and repeated calculations."],
              ["Leanport HR", "Requests, approvals, balances, salary history, documents, reports, notifications, and settings in one workspace."],
              ["Employee experience", "Employees can view their data, apply for leave, check balances, review salary history, and download paid salary slips."],
            ].map(([title, text], index) => (
              <div key={title} className={`p-6 ${index !== 2 ? "border-b border-slate-200" : ""}`}>
                <h3 className="font-bold text-[#222875]">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Security posture"
          title="Authentication, sessions, and protected routes are part of the foundation."
          description="The implementation uses JWT-based login, persisted sessions, role-protected frontend routes, backend auth middleware, password reset flows, and employee suspension login blocking."
          center
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [LockKeyhole, "JWT authentication", "Token payloads include user, company, and role context."],
            [UserCog, "Role-aware access", "Admin, light admin, and employee route groups are separated."],
            [FileText, "Traceable actions", "Leave and employee events create activity, notification, and email records."],
          ].map(([Icon, title, text]) => (
            <FeatureTile key={title} icon={Icon} title={title} description={text} />
          ))}
        </div>
      </div>
    </section>

    <CTASection
      title="Use a product that matches how your HR data actually moves."
      description="Create a Leanport HR company workspace and replace scattered tracking with role-based workflows."
    />
  </PageShell>
);

const companyPrinciples = [
  {
    icon: ClipboardCheck,
    title: "Operational accuracy",
    description: "Leave approvals, balances, salary records, employee profiles, documents, reports, and settings are treated as connected workflows.",
  },
  {
    icon: ShieldCheck,
    title: "Role clarity",
    description: "Admins, light admins, and employees work in protected areas that match their responsibility in the company.",
  },
  {
    icon: Database,
    title: "Company context",
    description: "The system keeps employee, leave, salary, notification, activity, setting, and file records scoped to the company workspace.",
  },
];

export const CompanyAbout = () => (
  <PageShell
    eyebrow="About Leanport HR"
    title="A focused HR workspace for leave, salary, documents, and employee self-service."
    description="Leanport HR is a full-stack Leave Management System built for companies that need structured employee administration, reliable leave workflows, salary slip handling, reports, notifications, and configurable company settings."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionIntro
            eyebrow="Product purpose"
            title="Built to replace scattered daily HR tracking."
            description="The product is centered on the workflows already implemented in the application: company onboarding, employees, leave, salary history, salary slips, notifications, dashboards, file uploads, and settings."
          />
          <div className="grid gap-5">
            {companyPrinciples.map((principle) => (
              <FeatureTile key={principle.title} {...principle} />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#f8fbff] py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="What the product covers"
          title="One workspace for the records HR teams touch most often."
          description="Leanport HR connects the employee lifecycle with leave, salary, documents, notifications, dashboards, and company configuration."
          center
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Company registration and defaults",
            "Employee invitation and profiles",
            "Leave requests and approvals",
            "Salary history and PDF slips",
            "Document uploads and categories",
            "Realtime and stored notifications",
            "Reports and dashboard metrics",
            "Departments, designations, currencies, and leave types",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold leading-7 text-slate-700 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTASection
      title="Create a company workspace that mirrors real HR work."
      description="Start with company setup and move employee records, leave, salary, documents, and reports into one role-aware system."
    />
  </PageShell>
);

const contactMethods = [
  {
    icon: MailCheck,
    title: "Product support",
    description: "Use this channel for setup questions, account access, leave workflow, salary slip, and employee portal help.",
    value: "support@leanporthr.com",
  },
  {
    icon: Phone,
    title: "Sales conversation",
    description: "Talk through company size, rollout scope, employee records, reports, and pricing fit.",
    value: "+1 (555) 000-0000",
  },
  {
    icon: MapPin,
    title: "Company address",
    description: "Use this contact point for formal company correspondence and product inquiries.",
    value: "123 Business Ave, Tech City, TC 45678",
  },
];

export const CompanyContact = () => (
  <PageShell
    eyebrow="Contact"
    title="Talk to us about setting up Leanport HR for your company."
    description="Reach out for help with company onboarding, employee setup, leave workflows, salary records, documents, reports, notifications, and pricing scope."
  >
    <section className="py-20 sm:py-24">
      <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="grid gap-5">
            {contactMethods.map((method) => (
              <FeatureTile key={method.title} {...method} items={[method.value]} />
            ))}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222875] text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Request a setup discussion</h2>
                <p className="mt-1 text-sm text-slate-500">This form is a front-end contact experience for routing inquiries.</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25" placeholder="First name" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25" placeholder="Last name" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25" placeholder="Work email" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25" placeholder="Company name" />
              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25 sm:col-span-2" defaultValue="">
                <option value="" disabled>What do you want to discuss?</option>
                <option>Company onboarding</option>
                <option>Leave management</option>
                <option>Employee records and documents</option>
                <option>Salary records and salary slips</option>
                <option>Pricing and rollout scope</option>
              </select>
              <textarea className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#222875] focus:ring-4 focus:ring-[#90D7F5]/25 sm:col-span-2" placeholder="Tell us what your HR team needs to manage." />
            </div>
            <a
              href="mailto:support@leanporthr.com?subject=Leanport%20HR%20setup%20discussion"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#222875] px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-100 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1a1f5c]"
            >
              Email setup request
              <Send className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </PageShell>
);

const faqGroups = [
  {
    category: "Product",
    items: [
      ["What does Leanport HR manage?", "Leanport HR manages company onboarding, employees, leave workflows, salary records, salary slips, documents, notifications, dashboards, reports, and company settings."],
      ["Is attendance fully backend-backed?", "The employee Time Logs screen currently provides a frontend time-log UI with simulated clock-in and clock-out state. The project documentation does not list a backend attendance model or persistence API."],
      ["Does the product include a mobile app?", "The current frontend is a responsive React web application. The public pages should describe responsive access rather than a separate native mobile app."],
    ],
  },
  {
    category: "Access and roles",
    items: [
      ["Which roles are supported?", "The product supports admin, light admin, and employee roles. Admin and light admin users use protected admin routes, while employees use a separate employee portal."],
      ["How do employees get access?", "Admins create employees, the system sends an invite email, and employees use the verification flow to create their first password."],
      ["Can suspended employees log in?", "The backend permission model blocks employee login when an employee is suspended."],
    ],
  },
  {
    category: "Leave and salary",
    items: [
      ["How are leave balances updated?", "Employee leave balances are initialized from company leave settings and are updated when leave requests are approved. Admins can also adjust balances manually."],
      ["Can salary slips be generated?", "Admins can generate PDF salary slips for salary history records, and employees can download slips for paid salary records."],
      ["Are reports available?", "Admin dashboards include leave metrics, leave report email support, CSV download, and yearly leave summary views."],
    ],
  },
];

const FAQRow = ({ question, answer, isOpen, onToggle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
    >
      <span className="font-bold text-slate-950">{question}</span>
      <ChevronDown className={`h-5 w-5 shrink-0 text-[#222875] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
      <div className="overflow-hidden">
        <p className="border-t border-slate-100 px-5 py-4 leading-7 text-slate-600">{answer}</p>
      </div>
    </div>
  </div>
);

export const CompanyFAQ = () => {
  const [openKey, setOpenKey] = useState("Product-0");

  return (
    <PageShell
      eyebrow="FAQ"
      title="Clear answers about what Leanport HR currently supports."
      description="These answers are based on the implemented product modules: company setup, employees, leave, salary, documents, notifications, dashboards, reports, and settings."
    >
      <section className="py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <SectionIntro
              eyebrow="Questions"
              title="Product-specific answers without generic HR claims."
              description="Use this page to understand access, onboarding, leave, salary, reports, and the current scope of time logs."
            />
            <div className="grid gap-8">
              {faqGroups.map((group) => (
                <div key={group.category}>
                  <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-950">
                    <HelpCircle className="h-5 w-5 text-[#222875]" />
                    {group.category}
                  </h2>
                  <div className="grid gap-3">
                    {group.items.map(([question, answer], index) => {
                      const key = `${group.category}-${index}`;
                      return (
                        <FAQRow
                          key={question}
                          question={question}
                          answer={answer}
                          isOpen={openKey === key}
                          onToggle={() => setOpenKey(openKey === key ? "" : key)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

const legalSections = {
  privacy: {
    icon: FileLock2,
    eyebrow: "Privacy Policy",
    title: "How Leanport HR handles product data.",
    description: "This policy explains the kinds of data the LMS product processes for company setup, account access, employees, leave, salary, documents, notifications, reports, and files.",
    sections: [
      ["Data we process", "Company information, admin account details, employee profile data, addresses, personal information, documents, salary records, leave requests, leave balances, notifications, activity logs, session records, and uploaded file metadata may be processed as part of the product."],
      ["Why data is used", "Data is used to create company workspaces, authenticate users, manage employees, process leave workflows, maintain salary history, generate salary slips, store documents, send notifications and emails, and produce dashboards or reports."],
      ["Access controls", "Access is separated by admin, light admin, and employee roles. Company-scoped data access and protected frontend/backend routes are part of the product design."],
      ["Storage and files", "The backend uses PostgreSQL through Sequelize for application records and Cloudinary-backed file handling for uploaded documents and generated salary slip files."],
      ["Security practices", "The application uses bcrypt password hashing, JWT authentication, persisted sessions, route protection, validation, and session cleanup on logout."],
      ["Contact", "For privacy questions, contact support@leanporthr.com."],
    ],
  },
  terms: {
    icon: Scale,
    eyebrow: "Terms & Conditions",
    title: "Terms for using the Leanport HR website and product.",
    description: "These terms describe expected use of the public website and LMS product. They are written for the current product scope and should be reviewed by legal counsel before formal publication.",
    sections: [
      ["Use of the service", "Leanport HR is intended for company onboarding, employee administration, leave management, salary record handling, document management, notifications, dashboards, reports, and settings."],
      ["Account responsibility", "Company admins are responsible for creating authorized users, maintaining accurate employee records, managing access, and protecting login credentials."],
      ["Employee and payroll records", "Salary and employee data entered into the system should be accurate and authorized by the company. Salary slips and reports are generated from stored product data."],
      ["Acceptable use", "Users should not upload unlawful content, attempt unauthorized access, bypass role boundaries, disrupt service operation, or misuse employee data."],
      ["Product scope", "Features should be interpreted according to the implemented application modules. For example, Time Logs are currently a frontend UI rather than a persisted backend attendance system."],
      ["Contact", "For terms questions, contact support@leanporthr.com."],
    ],
  },
  cookies: {
    icon: Cookie,
    eyebrow: "Cookie Policy",
    title: "Browser storage and session behavior in Leanport HR.",
    description: "This page explains how the product uses essential browser storage and session behavior for login, role-aware access, and application operation.",
    sections: [
      ["Essential storage", "The frontend stores authenticated user and token data in localStorage so API requests can include Authorization headers and users can remain signed in during normal use."],
      ["Consent choices", "Public website visitors can accept all optional storage, reject optional storage, or manage choices. The selected choice is stored locally as leanport_cookie_consent so the banner does not repeat on every page."],
      ["Session handling", "The backend persists sessions in UserSession records and removes matching tokens during logout. Axios interceptors redirect users to login after unauthorized responses."],
      ["Why storage is needed", "Storage supports login state, route protection, role-aware portal access, and API authentication for admin, light admin, and employee users."],
      ["Third-party services", "The product uses Cloudinary-backed file handling and email workflows. Those services may involve their own operational logging or policies outside this browser storage page."],
      ["Managing storage", "Users can clear browser storage, but doing so may log them out or require a fresh login."],
      ["Contact", "For cookie or browser storage questions, contact support@leanporthr.com."],
    ],
  },
};

const LegalPage = ({ type }) => {
  const page = legalSections[type];
  const Icon = page.icon;

  return (
    <PageShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      actions={false}
    >
      <section className="py-20 sm:py-24">
        <div className="max-w-8xl mx-auto xl:mx-60 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#222875] text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">Plain-language policy</h2>
              <p className="mt-3 leading-7 text-slate-600">
                This page is product-specific website copy and not a substitute for jurisdiction-specific legal advice.
              </p>
            </div>
            <div className="grid gap-4">
              {page.sections.map(([heading, text]) => (
                <div key={heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#222875]">{heading}</h3>
                  <p className="mt-3 leading-8 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export const CompanyPrivacyPolicy = () => <LegalPage type="privacy" />;
export const CompanyTermsConditions = () => <LegalPage type="terms" />;
export const CompanyCookiePolicy = () => <LegalPage type="cookies" />;
