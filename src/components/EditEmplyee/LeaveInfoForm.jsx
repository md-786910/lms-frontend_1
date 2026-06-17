import React, { forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";
import NoDataFound from "../../common/NoDataFound";
import { formatLeaveDays } from "../../utility/utility";

const leaveTypes = [
  {
    key: "casual",
    label: "Casual Leave",
    icon: "🌤️",
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "earned",
    label: "Earned Leave",
    icon: "⏱️",
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    key: "lop",
    label: "Leave Without Pay",
    icon: "🚫",
    bg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    key: "paternity",
    label: "Paternity Leave",
    icon: "👶",
    bg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    key: "sabbatical",
    label: "Sabbatical Leave",
    icon: "🔁",
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    key: "sick",
    label: "Sick Leave",
    icon: "🩺",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const LeaveInfoForm = forwardRef(({ leaveInfo, setLeaveInfo }, ref) => {
  useImperativeHandle(ref, () => ({
    validate: () => true,
  }));

  const updateValue = (id, field, delta) => {
    setLeaveInfo((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
            ...leave,
            addon: field === "available" ? 0 : 0,
            subst: field === "booked" ? 0 : 0,
          }
          : { ...leave, addon: 0, subst: 0 }
      )
    );
  };

  return (
    <div className="space-y-4 font-montserrat">
      {leaveInfo?.map((leave, index) => {
        const { leave_count, leave_used, leave_type, id } =
          leave;
        const yearlyTotal = leave?.yearly_total ?? leave_count ?? 0;
        const yearlyUsed = leave?.yearly_used ?? leave_used ?? 0;
        const yearlyRemaining =
          leave?.yearly_remaining ??
          Math.max(0, Number(yearlyTotal || 0) - Number(yearlyUsed || 0));
        const cycleTotal =
          leave?.cycle_total ?? (Number(leave_count || 0) / 2);
        const firstCycleTotal = leave?.first_cycle_total ?? cycleTotal;
        const firstCycleUsed = leave?.first_cycle_used ?? 0;
        const firstCycleRemaining =
          leave?.first_cycle_remaining ??
          Math.max(0, Number(firstCycleTotal || 0) - Number(firstCycleUsed || 0));
        const secondCycleTotal = leave?.second_cycle_total ?? cycleTotal;
        const secondCycleUsed = leave?.second_cycle_used ?? 0;
        const secondCycleRemaining =
          leave?.second_cycle_remaining ??
          Math.max(0, Number(secondCycleTotal || 0) - Number(secondCycleUsed || 0));
        const config = leaveTypes.find(t => t.label.toLowerCase().includes(leave_type.toLowerCase())) || leaveTypes[index % leaveTypes.length];
        const { icon, bg, iconColor } = config;

        return (
          <div
            key={id || index}
            className="flex flex-col gap-5 p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-200 group lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex items-center gap-5">
              <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-200", bg, iconColor)}>
                {icon}
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-800">
                  {leave_type}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Total Annual leave: <span className="text-slate-900 font-extrabold">{leave_count} days</span>
                </div>
              </div>
            </div>

            {/* Leave Controls */}
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-1">
              {[
                {
                  title: "Yearly",
                  subtitle: "Current year",
                  stats: [
                    { label: "Remaining", value: yearlyRemaining, color: "text-emerald-600" },
                    { label: "Used", value: yearlyUsed, color: "text-amber-600" },
                    { label: "Total", value: yearlyTotal, color: "text-slate-700" },
                  ],
                },
                // {
                //   title: "1st Cycle",
                //   subtitle: leave?.first_cycle_label ?? "Jan-Jun",
                //   stats: [
                //     { label: "Remaining", value: firstCycleRemaining, color: "text-emerald-600" },
                //     { label: "Used", value: firstCycleUsed, color: "text-amber-600" },
                //     { label: "Total", value: firstCycleTotal, color: "text-slate-700" },
                //   ],
                // },
                // {
                //   title: "2nd Cycle",
                //   subtitle: leave?.second_cycle_label ?? "Jul-Dec",
                //   stats: [
                //     { label: "Remaining", value: secondCycleRemaining, color: "text-emerald-600" },
                //     { label: "Used", value: secondCycleUsed, color: "text-amber-600" },
                //     { label: "Total", value: secondCycleTotal, color: "text-slate-700" },
                //   ],
                // },
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                >
                  <div className="mb-2">
                    <div className="text-xs font-black uppercase text-slate-700">
                      {group.title}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {group.subtitle}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {group.stats.map((field) => (
                      <div key={`${group.title}-${field.label}`} className="text-center group/stat">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 transition-colors group-hover/stat:text-slate-600">
                          {field.label}
                        </div>
                        <div className="flex items-center justify-center min-h-10 min-w-16 bg-white rounded-lg border border-slate-100 shadow-inner group-hover/stat:border-slate-200 transition-all px-2">
                          <span className={cn("text-base font-black", field.color)}>
                            {formatLeaveDays(field.value || 0)}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">days</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {leaveInfo?.length === 0 && <div className="p-8"><NoDataFound /></div>}
    </div>
  );
});

export default LeaveInfoForm;
