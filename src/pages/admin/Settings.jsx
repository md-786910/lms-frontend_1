import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import settingTabs from "../../data/settingTab";

const Settings = ({ children }) => {
  const location = useLocation();
  const activePath = location.pathname.toLowerCase();

  return (
    <div className="space-y-4 mb-4">
      {/* Hero / Page header */}
      <div className="relative overflow-hidden rounded-md border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-primary shadow-[0_24px_80px_rgba(15,23,42,0.22)] px-6 py-6 sm:px-10 sm:py-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0,rgba(59,130,246,0.18),transparent_30%)]" />
        <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight">
                System Settings
              </h1>
              <p className="text-sm text-slate-200/90">
                Configure the guardrails, defaults, and policies that keep your HR workspace consistent.
                Changes apply instantly across admin experiences.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin only
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Live updates
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-inner backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-200">
                Sections
              </p>
              <p className="text-2xl font-semibold leading-tight">
                {settingTabs.length}
              </p>
              <p className="text-xs text-slate-200/80">Configuration areas</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-inner backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-200">
                Status
              </p>
              <p className="text-2xl font-semibold leading-tight">Active</p>
              <p className="text-xs text-slate-200/80">Settings synced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation with sticky behavior className="sticky top-20 md:top-24 z-30" */}
      <div>
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-shadow duration-300 will-change-transform">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Configuration areas
              </h2>
              <p className="text-sm text-slate-500">
                Pick a section below. Your current selection stays highlighted while you work through the form.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              System settings
            </span>
          </div>

          <div className="p-2 sm:p-6">
            <div className="grid gap-3 md:grid-cols-7 xl:grid-cols-7">
              {settingTabs?.map((tab) => {
                const isActive =
                  activePath === tab.link.toLowerCase() ||
                  activePath.startsWith(`${tab.link.toLowerCase()}/`);
                const Icon = tab.icon;

                return (
                  <NavLink
                    to={tab.link}
                    key={tab.id}
                    className={`group relative flex items-start gap-4 rounded-2xl border px-4 py-4 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-white text-slate-900 shadow-sm border border-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {tab.name}
                        </p>
                        {isActive && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isActive ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {tab.description}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]">
                        <span className={isActive ? "text-slate-200" : "text-slate-400"}>
                          Configure
                        </span>
                        <ArrowUpRight
                          className={`h-3.5 w-3.5 ${
                            isActive ? "text-slate-200" : "text-slate-400"
                          } transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                        />
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Routed content below keeps sticky context */}
      {children && <div className="space-y-6">{children}</div>}
    </div>
  );
};

export default Settings;
