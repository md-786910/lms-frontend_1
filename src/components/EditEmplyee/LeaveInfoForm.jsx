import React, { forwardRef, useImperativeHandle } from "react";
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
    key: "maternity",
    label: "Maternity Leave",
    icon: "M",
    bg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    key: "sick",
    label: "Sick Leave",
    icon: "🩺",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const LeaveInfoForm = forwardRef(({ leaveInfo }, ref) => {
  useImperativeHandle(ref, () => ({
    validate: () => true,
  }));

  return (
    <div className="space-y-4 font-graphik">
      {leaveInfo?.map((leave, index) => {
        const { leave_type, id } = leave;
        const totalLeave = Number(leave?.leave_count) || 0;
        const normalizedLeaveType = String(leave_type || "").toLowerCase();
        const config =
          leaveTypes.find(
            (t) =>
              t.key === normalizedLeaveType ||
              t.label.toLowerCase().includes(normalizedLeaveType)
          ) || leaveTypes[index % leaveTypes.length];
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
                  Leave activity breakdown
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="min-w-28 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-center">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Total Leave
                </div>
                <div className="mt-1 text-lg font-black text-slate-900">
                  {formatLeaveDays(totalLeave)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {leaveInfo?.length === 0 && <div className="p-8"><NoDataFound /></div>}
    </div>
  );
});

export default LeaveInfoForm;
