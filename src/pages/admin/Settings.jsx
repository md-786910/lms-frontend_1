import { ShieldCheck, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import settingTabs from "../../data/settingTab";

const Settings = ({ children }) => {
  const location = useLocation();
  const activePath = location.pathname.toLowerCase();

  return (
    <div className="space-y-4 mb-4">
      {/* Hero / Page header */}
      <div className="relative overflow-hidden rounded-md border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-primary shadow-[0_24px_80px_rgba(15,23,42,0.22)] px-6 py-6 sm:px-10 sm:py-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-slate-900" />
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
          </div>

          <div className="p-2 sm:p-6">
            <div className="overflow-x-auto pb-1">
              <div className="flex flex-wrap gap-3">
                {settingTabs?.map((tab) => {
                  const isActive =
                    activePath === tab.link.toLowerCase() ||
                    activePath.startsWith(`${tab.link.toLowerCase()}/`);
                  const Icon = tab.icon;

                  return (
                    <NavLink
                      to={tab.link}
                      key={tab.id}
                      className={`group inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/30"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-base ${
                          isActive
                            ? "border-transparent bg-white text-slate-900"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{tab.name}</span>
                    </NavLink>
                  );
                })}
              </div>
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
