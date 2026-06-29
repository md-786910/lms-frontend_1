import { ShieldCheck, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import settingTabs from "../../data/settingTab";
import { Card, CardContent } from "@/components/ui/card";

const Settings = ({ children }) => {
  const location = useLocation();
  const activePath = location.pathname.toLowerCase();

  return (
    <div className="space-y-4 mb-4">
      {/* Hero / Page header */}
      <Card className="border border-slate-200 shadow-lg rounded-md bg-slate-900 text-white">
        <CardContent className="p-5 md:p-7">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-graphik text-[#FFFFFF]">System Settings</h1>
              </div>
              <p className="text-[#FFFFFF] font-medium text-sm font-graphik">
                Configure the guardrails, defaults, and policies that keep your HR workspace consistent.
                Changes apply instantly across admin experiences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation with sticky behavior className="sticky top-20 md:top-24 z-30" */}
      <div>
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-shadow duration-300 will-change-transform">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold font-graphik text-slate-900">
                Configuration areas
              </h2>
              <p className="font-medium text-sm font-graphik text-[#131313]">
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
                      className={`group inline-flex items-center gap-3 rounded-full px-4 py-2 text-base font-medium text-slate-700 shadow-sm transition font-graphik duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/30 font-graphik"
                          : "border border-[#e2e8f0] bg-white text-slate-700 hover:border-emerald-100 hover:bg-slate-50 font-graphik"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-base ${
                          isActive
                            ? "border-transparent bg-[#e2e8f0] text-[#047857]"
                            : "border-[#e2e8f0] bg-[#e2e8f0] text-[#047857]"
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
