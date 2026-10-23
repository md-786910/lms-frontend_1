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
      <Card className="border border-[#E1D4C7] shadow-xl rounded-3xl bg-gradient-to-r from-[#24130A] via-[#734425] to-[#5D361D] text-white">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 md:col-span-8 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tight text-white">System Settings</h1>
              </div>
              <p className="text-[#F5ECE4]/80 font-medium text-sm font-sans">
                Configure the guardrails, defaults, and policies that keep your HR workspace consistent.
                Changes apply instantly across admin experiences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div>
        <div className="rounded-3xl border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm transition-shadow duration-300">
          <div className="flex flex-col gap-2 border-b border-[#E1D4C7]/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold uppercase tracking-tight text-[#2E2E2E]">
                Configuration areas
              </h2>
              <p className="font-medium text-sm text-[#2E2E2E]/70 font-sans">
                Pick a section below. Your current selection stays highlighted while you work through the form.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            <div className="overflow-x-auto pb-1">
              <div className="flex flex-wrap gap-2.5">
                {settingTabs?.map((tab) => {
                  const isActive =
                    activePath === tab.link.toLowerCase() ||
                    activePath.startsWith(`${tab.link.toLowerCase()}/`);
                  const Icon = tab.icon;

                  return (
                    <NavLink
                      to={tab.link}
                      key={tab.id}
                      className={`group inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C26819] ${
                        isActive
                          ? "border border-[#734425] bg-[#734425] text-white shadow-md shadow-[#734425]/20 font-heading"
                          : "border border-[#E1D4C7] bg-[#F5ECE4]/70 text-[#2E2E2E]/80 hover:border-[#734425]/40 hover:bg-[#F5ECE4]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#E1D4C7]/50 text-[#734425]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
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
