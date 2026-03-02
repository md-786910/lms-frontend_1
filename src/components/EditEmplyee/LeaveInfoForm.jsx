import React, { forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils"; 
import NoDataFound from "../../common/NoDataFound";

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
        const { leave_count, leave_remaing, leave_used, leave_type, id } =
          leave;
        const config = leaveTypes.find(t => t.label.toLowerCase().includes(leave_type.toLowerCase())) || leaveTypes[index % leaveTypes.length];
        const { icon, bg, iconColor } = config;

        return (
          <div
            key={id || index}
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
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
            <div className="flex items-center gap-8">
              {[
                { label: "Available", value: leave?.leave_remaing, color: "text-emerald-600" },
                { label: "Booked", value: leave?.leave_used, color: "text-amber-600" }
              ].map((field) => (
                <div key={field.label} className="text-center group/stat">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 transition-colors group-hover/stat:text-slate-600">
                    {field.label}
                  </div>
                  <div className="flex items-center justify-center h-10 w-20 bg-slate-50 rounded-lg border border-slate-100 shadow-inner group-hover/stat:bg-white group-hover/stat:border-slate-200 transition-all">
                    <span className={cn("text-lg font-black", field.color)}>
                      {field.value || 0}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">days</div>
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
