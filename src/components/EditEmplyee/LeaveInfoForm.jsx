import React, { forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils"; // If you're using Tailwind + classNames utility
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
              addon:
                field === "available" ? Number(leave.addon || 0) + delta : 0,
              subst: field === "booked" ? Number(leave.subst || 0) - delta : 0,
            }
          : { ...leave, addon: 0, subst: 0 }
      )
    );
  };

  return (
    <div className="space-y-4 mt-6">
      {leaveInfo?.map((leave, index) => {
        const { leave_count, leave_remaing, leave_used, leave_type, id } =
          leave;
        const { gb, key, icon, bg, iconColor } = leaveTypes[index];

        return (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-md border"
          >
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-4">
                <div className={cn("p-3 rounded-md text-xl", bg, iconColor)}>
                  {icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    {leave_type}
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-3 mt-1">
                    <span>
                      Total Annual leave: <strong>{leave_count}</strong> days
                    </span>
                    <span>
                      Available: <strong>{leave_remaing}</strong> days
                    </span>
                    <span>
                      Booked: <strong>{leave_used}</strong> days
                    </span>

                    <span>
                      Addon: <strong>{leave?.addon || 0}</strong> days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Controls */}
            <div className="flex items-center gap-6">
              {["available", "booked"].map((field) => (
                <div key={field} className="text-center">
                  <div className="text-xs text-slate-500 font-medium capitalize mb-1">
                    {field}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border">
                    <button
                      className="text-slate-600 hover:text-black font-bold"
                      onClick={() => {
                        updateValue(id, field, -1);
                      }}
                    >
                      –
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {(field === "available" ? leave?.addon : leave?.subst) ||
                        0}
                    </span>
                    <button
                      className="text-slate-600 hover:text-black font-bold"
                      onClick={() => {
                        updateValue(id, field, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1">days</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {leaveInfo?.length === 0 && <NoDataFound />}
    </div>
  );
});

export default LeaveInfoForm;
